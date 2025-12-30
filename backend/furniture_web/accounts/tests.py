from django.test import TestCase
from django.contrib.auth import get_user_model
from .serializers import SignupSerializer, LoginSerializer

User = get_user_model()


class CustomUserModelTest(TestCase):
    
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'full_name': 'Test User',
            'password': 'testpass123'
        }
    
    def test_create_user(self):
        user = User.objects.create_user(**self.user_data)
        
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.full_name, self.user_data['full_name'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    
    def test_create_user_without_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email='',
                full_name='Test User',
                password='testpass123'
            )
    
    def test_create_user_without_full_name(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email='test@example.com',
                full_name='',
                password='testpass123'
            )


class SignupSerializerTest(TestCase):
    
    def test_valid_signup_data(self):
        data = {
            'email': 'newuser@example.com',
            'full_name': 'New User',
            'password': 'securepass123',
            'confirm_password': 'securepass123'
        }
        serializer = SignupSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_password_mismatch(self):
        data = {
            'email': 'newuser@example.com',
            'full_name': 'New User',
            'password': 'securepass123',
            'confirm_password': 'differentpass123'
        }
        serializer = SignupSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('confirm_password', serializer.errors)
    
    def test_weak_password(self):
        data = {
            'email': 'newuser@example.com',
            'full_name': 'New User',
            'password': '123',
            'confirm_password': '123'
        }
        serializer = SignupSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
    
    


class LoginSerializerTest(TestCase):
    
    def test_valid_login_data(self):
        data = {
            'email': 'user@example.com',
            'password': 'password123'
        }
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_missing_email(self):
        data = {
            'password': 'password123'
        }
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
    
    def test_missing_password(self):
        data = {
            'email': 'user@example.com'
        }
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
    
    def test_invalid_email_format(self):
        data = {
            'email': 'invalid-email',
            'password': 'password123'
        }
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)