from django.test import TestCase
from django.contrib.auth import get_user_model
from decimal import Decimal
from shop.models import (
    Category, Product, ProductImage, ProductVariant,
    Cart, CartItem, Order, OrderItem
)

User = get_user_model()


class CategoryModelTest(TestCase):
    """Test cases for Category model"""
    
    def setUp(self):
        self.category = Category.objects.create(
            name="Sofas",
            description="Comfortable sofas",
            is_active=True
        )
    
    def test_category_creation(self):
        """Test creating a category"""
        self.assertEqual(self.category.name, "Sofas")
        self.assertEqual(str(self.category), "Sofas")
        self.assertTrue(self.category.is_active)
    
    def test_slug_auto_generation(self):
        """Test that slug is automatically generated"""
        self.assertEqual(self.category.slug, "sofas")
    
    def test_category_ordering(self):
        """Test categories are ordered by name"""
        Category.objects.create(name="Beds")
        Category.objects.create(name="Chairs")
        categories = Category.objects.all()
        self.assertEqual(categories[0].name, "Beds")
        self.assertEqual(categories[1].name, "Chairs")


class ProductModelTest(TestCase):
    """Test cases for Product model"""
    
    def setUp(self):
        self.category = Category.objects.create(name="Sofas")
        self.product = Product.objects.create(
            title="Modern Sofa",
            category=self.category,
            general_category="Living Room",
            vendor="Furniture Co",
            min_price=Decimal("299.99"),
            max_price=Decimal("499.99"),
            description="A beautiful modern sofa",
            free_shipping=True,
            available="in",
            items_in_stock=10,
            sold=5
        )
    
    def test_product_creation(self):
        """Test creating a product"""
        self.assertEqual(self.product.title, "Modern Sofa")
        self.assertEqual(str(self.product), "Modern Sofa")
        self.assertEqual(self.product.category, self.category)
    
    def test_slug_auto_generation(self):
        """Test that slug is automatically generated"""
        self.assertEqual(self.product.slug, "modern-sofa")
    
    def test_product_price_property(self):
        """Test product price property returns correct format"""
        # With max_price
        self.assertEqual(self.product.price, [299.99, 499.99])
        
        # Without max_price
        product2 = Product.objects.create(
            title="Simple Chair",
            category=self.category,
            min_price=Decimal("99.99"),
            description="A simple chair"
        )
        self.assertEqual(product2.price, 99.99)
    
    def test_product_availability_choices(self):
        """Test product availability choices"""
        self.assertEqual(self.product.available, "in")
        self.product.available = "out"
        self.product.save()
        self.assertEqual(self.product.available, "out")


class ProductImageModelTest(TestCase):
    """Test cases for ProductImage model"""
    
    def setUp(self):
        category = Category.objects.create(name="Sofas")
        self.product = Product.objects.create(
            title="Modern Sofa",
            category=category,
            min_price=Decimal("299.99"),
            description="A sofa"
        )
    
    def test_product_image_creation(self):
        """Test creating a product image"""
        image = ProductImage.objects.create(
            product=self.product,
            image_url="https://example.com/image1.jpg",
            order=1
        )
        self.assertEqual(image.product, self.product)
        self.assertEqual(image.order, 1)
    
    def test_product_image_ordering(self):
        """Test images are ordered by order field"""
        ProductImage.objects.create(product=self.product, image_url="img3.jpg", order=3)
        ProductImage.objects.create(product=self.product, image_url="img1.jpg", order=1)
        ProductImage.objects.create(product=self.product, image_url="img2.jpg", order=2)
        
        images = self.product.images.all()
        self.assertEqual(images[0].order, 1)
        self.assertEqual(images[1].order, 2)
        self.assertEqual(images[2].order, 3)


class ProductVariantModelTest(TestCase):
    """Test cases for ProductVariant model"""
    
    def setUp(self):
        category = Category.objects.create(name="Sofas")
        self.product = Product.objects.create(
            title="Modern Sofa",
            category=category,
            min_price=Decimal("299.99"),
            description="A sofa"
        )
    
    def test_variant_creation(self):
        """Test creating a product variant"""
        variant = ProductVariant.objects.create(
            product=self.product,
            variant_id="size-small",
            title="Small",
            price=Decimal("299.99"),
            is_default=True
        )
        self.assertEqual(variant.title, "Small")
        self.assertTrue(variant.is_default)
    
    def test_variant_ordering_by_price(self):
        """Test variants are ordered by price"""
        ProductVariant.objects.create(
            product=self.product,
            variant_id="size-large",
            title="Large",
            price=Decimal("499.99")
        )
        ProductVariant.objects.create(
            product=self.product,
            variant_id="size-small",
            title="Small",
            price=Decimal("299.99")
        )
        
        variants = self.product.variants.all()
        self.assertEqual(variants[0].price, Decimal("299.99"))
        self.assertEqual(variants[1].price, Decimal("499.99"))


class CartModelTest(TestCase):
    """Test cases for Cart model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            full_name="Test User",
            password="testpass123"
        )
        self.category = Category.objects.create(name="Sofas")
        self.product = Product.objects.create(
            title="Modern Sofa",
            category=self.category,
            min_price=Decimal("299.99"),
            description="A sofa"
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            variant_id="size-large",
            title="Large",
            price=Decimal("299.99")
        )
    
    def test_cart_creation_for_user(self):
        """Test creating a cart for authenticated user"""
        cart = Cart.objects.create(user=self.user)
        self.assertEqual(cart.user, self.user)
        self.assertTrue(cart.is_active)
        self.assertEqual(str(cart), f"Cart for {self.user.email}")
    
    def test_cart_creation_for_guest(self):
        """Test creating a cart for guest user"""
        cart = Cart.objects.create(session_id="guest123")
        self.assertEqual(cart.session_id, "guest123")
        self.assertEqual(str(cart), "Guest Cart guest123")
    
    def test_cart_total_items(self):
        """Test cart total_items property"""
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, variant=self.variant, quantity=2)
        CartItem.objects.create(cart=cart, product=self.product, variant=self.variant, quantity=3)
        
        self.assertEqual(cart.total_items, 5)
    
    def test_cart_subtotal(self):
        """Test cart subtotal calculation"""
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(
            cart=cart,
            product=self.product,
            variant=self.variant,
            quantity=2,
            price=Decimal("299.99")
        )
        
        self.assertEqual(cart.subtotal, Decimal("599.98"))


class CartItemModelTest(TestCase):
    """Test cases for CartItem model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            full_name="Test User",
            password="testpass123"
        )
        category = Category.objects.create(name="Sofas")
        self.product = Product.objects.create(
            title="Modern Sofa",
            category=category,
            min_price=Decimal("299.99"),
            description="A sofa"
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            variant_id="size-large",
            title="Large",
            price=Decimal("299.99")
        )
        self.cart = Cart.objects.create(user=self.user)
    
    def test_cart_item_creation(self):
        """Test creating a cart item"""
        item = CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            variant=self.variant,
            quantity=2,
            price=Decimal("299.99")
        )
        self.assertEqual(item.quantity, 2)
        self.assertEqual(item.price, Decimal("299.99"))
    
    def test_cart_item_total_price(self):
        """Test cart item total price calculation"""
        item = CartItem.objects.create(
            cart=self.cart,
            product=self.product,
            variant=self.variant,
            quantity=3,
            price=Decimal("299.99")
        )
        self.assertEqual(item.total_price, Decimal("899.97"))


class OrderModelTest(TestCase):
    """Test cases for Order model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            full_name="Test User",
            password="testpass123"
        )
    
    def test_order_creation(self):
        """Test creating an order"""
        order = Order.objects.create(
            user=self.user,
            email="test@example.com",
            full_name="Test User",
            phone="1234567890",
            shipping_address="123 Main St",
            shipping_city="Karachi",
            shipping_country="Pakistan",
            subtotal=Decimal("299.99"),
            shipping_cost=Decimal("50.00"),
            tax=Decimal("0.00"),
            total=Decimal("349.99"),
            status="pending",
            payment_status="pending"
        )
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.status, "pending")
        self.assertTrue(order.order_number.startswith("ORD-"))
    
    def test_order_number_auto_generation(self):
        """Test that order number is automatically generated"""
        order = Order.objects.create(
            full_name="Test User",
            shipping_address="123 Main St",
            shipping_city="Karachi",
            subtotal=Decimal("299.99"),
            total=Decimal("299.99")
        )
        self.assertIsNotNone(order.order_number)
        self.assertTrue(order.order_number.startswith("ORD-"))
    
    def test_order_status_choices(self):
        """Test order status can be updated"""
        order = Order.objects.create(
            full_name="Test User",
            shipping_address="123 Main St",
            shipping_city="Karachi",
            subtotal=Decimal("299.99"),
            total=Decimal("299.99")
        )
        order.status = "processing"
        order.save()
        self.assertEqual(order.status, "processing")


class OrderItemModelTest(TestCase):
    """Test cases for OrderItem model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            full_name="Test User",
            password="testpass123"
        )
        category = Category.objects.create(name="Sofas")
        self.product = Product.objects.create(
            title="Modern Sofa",
            category=category,
            min_price=Decimal("299.99"),
            description="A sofa"
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            variant_id="size-large",
            title="Large",
            price=Decimal("299.99")
        )
        self.order = Order.objects.create(
            user=self.user,
            full_name="Test User",
            shipping_address="123 Main St",
            shipping_city="Karachi",
            subtotal=Decimal("299.99"),
            total=Decimal("299.99")
        )
    
    def test_order_item_creation(self):
        """Test creating an order item"""
        item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            variant=self.variant,
            product_title="Modern Sofa",
            variant_title="Large",
            unit_price=Decimal("299.99"),
            quantity=2
        )
        self.assertEqual(item.quantity, 2)
        self.assertEqual(item.unit_price, Decimal("299.99"))
        self.assertEqual(item.total_price, Decimal("599.98"))
    
    def test_order_item_total_price_calculation(self):
        """Test order item automatically calculates total price"""
        item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            product_title="Modern Sofa",
            unit_price=Decimal("199.99"),
            quantity=3
        )
        self.assertEqual(item.total_price, Decimal("599.97"))
    
    def test_order_item_string_representation(self):
        """Test order item string representation"""
        item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            variant=self.variant,
            product_title="Modern Sofa",
            variant_title="Large",
            unit_price=Decimal("299.99"),
            quantity=2
        )
        self.assertEqual(str(item), "Modern Sofa - Large x 2")
