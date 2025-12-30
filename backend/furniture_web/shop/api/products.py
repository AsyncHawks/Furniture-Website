from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from shop.models import Product
from shop.serializers import ProductListSerializer, ProductDetailSerializer


# ==================== PRODUCTS ====================

@swagger_auto_schema(
    method='get',
    operation_description="Get paginated list of products with optional filtering by category",
    operation_id="list_products",
    tags=['Products'],
    manual_parameters=[
        openapi.Parameter(
            'category',
            openapi.IN_QUERY,
            description="Filter by category ID or slug",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'search',
            openapi.IN_QUERY,
            description="Search in product title and description",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'page',
            openapi.IN_QUERY,
            description="Page number",
            type=openapi.TYPE_INTEGER,
            required=False
        ),
        openapi.Parameter(
            'page_size',
            openapi.IN_QUERY,
            description="Number of items per page (default: 10, max: 100)",
            type=openapi.TYPE_INTEGER,
            required=False
        )
    ],
    responses={
        200: openapi.Response(
            description="List of products",
            examples={
                "application/json": {
                    "products": [
                        {
                            "id": 1,
                            "title": "Luxury King Bed Set",
                            "price": [95000, 120000],
                            "images": [
                                "https://example.com/image1.jpg",
                                "https://example.com/image2.jpg"
                            ],
                            "variants": [
                                {
                                    "id": "BED-STD",
                                    "title": "Standard King Size",
                                    "price": 95000
                                }
                            ]
                        }
                    ],
                    "pagination": {
                        "currentPage": 1,
                        "pageSize": 12,
                        "totalItems": 15,
                        "totalPages": 2
                    }
                }
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    """Get list of products with optional filtering"""
    products = Product.objects.select_related('category').prefetch_related('images', 'variants').all()
    
    # Filter by category
    category_filter = request.query_params.get('category', None)
    if category_filter:
        if category_filter.isdigit():
            products = products.filter(category_id=category_filter)
        else:
            products = products.filter(category__slug=category_filter)
    
    # Filter by availability
    available_filter = request.query_params.get('available', None)
    if available_filter:
        if available_filter.lower() == 'in':
            products = products.filter(available='in', items_in_stock__gt=0)
        elif available_filter.lower() == 'out':
            products = products.filter(available='out')
        elif available_filter.lower() == 'pre':
            products = products.filter(available='pre')
    
    # Filter by price range
    price_min = request.query_params.get('price_min', None)
    price_max = request.query_params.get('price_max', None)
    if price_min:
        try:
            products = products.filter(min_price__gte=float(price_min))
        except ValueError:
            pass
    if price_max:
        try:
            products = products.filter(min_price__lte=float(price_max))
        except ValueError:
            pass
    
    # Search
    search = request.query_params.get('search', None)
    if search:
        products = products.filter(title__icontains=search) | products.filter(description__icontains=search)
    
    # Sorting
    sort = request.query_params.get('sort', None)
    if sort:
        if sort == 'price_asc':
            products = products.order_by('min_price')
        elif sort == 'price_desc':
            products = products.order_by('-min_price')
        elif sort == 'newest':
            products = products.order_by('-created_at')
        elif sort == 'oldest':
            products = products.order_by('created_at')
        elif sort == 'name_asc':
            products = products.order_by('title')
        elif sort == 'name_desc':
            products = products.order_by('-title')
        elif sort == 'popular':
            products = products.order_by('-sold')
    
    # Pagination
    try:
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 12))
        page_size = min(page_size, 100)  # Max 100 items per page
    except ValueError:
        page = 1
        page_size = 12
    
    # Calculate pagination
    total_items = products.count()
    total_pages = (total_items + page_size - 1) // page_size  # Ceiling division
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    # Get paginated products
    paginated_products = products[start_idx:end_idx]
    serializer = ProductListSerializer(paginated_products, many=True)
    
    return Response({
        "products": serializer.data,
        "pagination": {
            "currentPage": page,
            "pageSize": page_size,
            "totalItems": total_items,
            "totalPages": total_pages
        }
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Get detailed information about a specific product including variants, buy together items, and related products",
    operation_id="get_product",
    tags=['Products'],
    manual_parameters=[
        openapi.Parameter(
            'id_or_slug',
            openapi.IN_PATH,
            description="Product ID or slug",
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Product details with full information",
            examples={
                "application/json": {
                    "product": {
                        "id": 1,
                        "title": "Luxury King Bed Set",
                        "price": [95000, 120000],
                        "slug": "luxury-king-bed-set",
                        "categories": ["Beds"],
                        "generalCategory": "Home Decor",
                        "vendor": "Vendor Name",
                        "description": "Premium king-size bed crafted from solid Sheesham wood.",
                        "features": [
                            "Hand-carved Sheesham wood frame",
                            "Premium mattress with soft cushioning"
                        ],
                        "images": [
                            "https://example.com/image1.jpg",
                            "https://example.com/image2.jpg"
                        ],
                        "freeShipping": False,
                        "available": "in",
                        "sold": 34,
                        "itemsInStock": 100,
                        "createdAt": "2025-01-16",
                        "variants": [
                            {
                                "id": "BED-STD",
                                "title": "Standard King Size",
                                "price": 95000
                            },
                            {
                                "id": "BED-LRG",
                                "title": "Premium King Size",
                                "price": 120000
                            }
                        ],
                        "buyTogether": [
                            {
                                "id": 2,
                                "title": "Premium Bed Linen Set",
                                "price": 8500,
                                "images": ["https://example.com/linen.jpg"],
                                "variants": [
                                    {"id": "LINEN-STD", "title": "Standard", "price": 8500}
                                ]
                            }
                        ],
                        "relatedProducts": [
                            {
                                "id": 4,
                                "title": "Golden Console with Mirror Frame",
                                "price": [38000, 52000],
                                "images": ["https://example.com/console.jpg"],
                                "variants": [
                                    {"id": "CONSOLE-STD", "title": "Standard", "price": 38000}
                                ]
                            }
                        ]
                    }
                }
            }
        ),
        404: openapi.Response(
            description="Product not found",
            examples={
                "application/json": {
                    "detail": "Product not found."
                }
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, id_or_slug):
    """Get detailed product information"""
    try:
        if str(id_or_slug).isdigit():
            product = get_object_or_404(
                Product.objects.select_related('category')
                .prefetch_related('images', 'variants', 'buy_together_items', 'related_items'),
                id=id_or_slug
            )
        else:
            product = get_object_or_404(
                Product.objects.select_related('category')
                .prefetch_related('images', 'variants', 'buy_together_items', 'related_items'),
                slug=id_or_slug
            )
    except:
        return Response(
            {"detail": "Product not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = ProductDetailSerializer(product)
    return Response({"product": serializer.data}, status=status.HTTP_200_OK)
