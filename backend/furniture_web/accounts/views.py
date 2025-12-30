from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import SignupSerializer, LoginSerializer, UserSerializer


def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@swagger_auto_schema(
    method='post',
    request_body=SignupSerializer,
    responses={
        201: openapi.Response(
            description="User created successfully",
            examples={
                "application/json": {
                    "message": "User created successfully",
                    "user": {
                        "id": 1,
                        "email": "john.doe@example.com",
                        "full_name": "John Doe",
                        "date_joined": "2025-12-23T10:30:00Z"
                    },
                    "tokens": {
                        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                    }
                }
            }
        ),
        400: openapi.Response(
            description="Bad Request",
            examples={
                "application/json": {
                    "email": ["This field is required."],
                    "password": ["This password is too short."],
                    "confirm_password": ["Password fields didn't match."]
                }
            }
        )
    },
    operation_description="Register a new user with email, full name, and password. Returns user details and JWT tokens.",
    operation_id="signup",
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    Register a new user
    
    Request body:
    - email: User's email address (required)
    - full_name: User's full name (required)
    - password: User's password (required, min 8 characters)
    - confirm_password: Password confirmation (required, must match password)
    """
    serializer = SignupSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Merge guest cart to user cart
        session_id = request.session.session_key
        if session_id:
            try:
                from shop.api.cart import merge_guest_cart_to_user
                merge_guest_cart_to_user(user, session_id)
            except Exception as e:
                pass  # Silently handle merge errors
        
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        
        return Response({
            'message': 'User created successfully',
            'user': user_data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)
    
    # Format error messages for better user experience
    errors = serializer.errors
    error_message = None
    
    # Check for specific field errors and return user-friendly message
    if 'email' in errors:
        if 'required' in str(errors['email']).lower():
            error_message = 'Email is required'
        elif 'already exists' in str(errors['email']).lower() or 'unique' in str(errors['email']).lower():
            error_message = 'An account with this email already exists'
        else:
            error_message = errors['email'][0] if isinstance(errors['email'], list) else str(errors['email'])
    
    elif 'password' in errors:
        # Get the first password error message
        password_errors = errors['password']
        if isinstance(password_errors, list) and len(password_errors) > 0:
            error_message = password_errors[0]
        else:
            error_message = str(password_errors)
    
    elif 'confirm_password' in errors:
        error_message = errors['confirm_password'][0] if isinstance(errors['confirm_password'], list) else str(errors['confirm_password'])
    
    elif 'full_name' in errors:
        error_message = errors['full_name'][0] if isinstance(errors['full_name'], list) else str(errors['full_name'])
    
    elif 'non_field_errors' in errors:
        error_message = errors['non_field_errors'][0] if isinstance(errors['non_field_errors'], list) else str(errors['non_field_errors'])
    
    else:
        # Return first error from any field
        for field, error_list in errors.items():
            if isinstance(error_list, list) and len(error_list) > 0:
                error_message = error_list[0]
                break
            else:
                error_message = str(error_list)
                break
    
    if not error_message:
        error_message = 'Invalid request. Please check your input'
    
    return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    request_body=LoginSerializer,
    responses={
        200: openapi.Response(
            description="Login successful",
            examples={
                "application/json": {
                    "message": "Login successful",
                    "user": {
                        "id": 1,
                        "email": "john.doe@example.com",
                        "full_name": "John Doe",
                        "date_joined": "2025-12-23T10:30:00Z"
                    },
                    "tokens": {
                        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                    }
                }
            }
        ),
        400: openapi.Response(
            description="Bad Request",
            examples={
                "application/json": {
                    "email": ["This field is required."],
                    "password": ["This field is required."]
                }
            }
        ),
        401: openapi.Response(
            description="Unauthorized",
            examples={
                "application/json": {
                    "error": "Invalid email or password"
                }
            }
        )
    },
    operation_description="Authenticate user with email and password. Returns user details and JWT tokens (access and refresh).",
    operation_id="login",
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user with email and password
    
    Request body:
    - email: User's email address (required)
    - password: User's password (required)
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        errors = serializer.errors
        
        # Return specific error messages
        if 'email' in errors:
            email_error = errors['email'][0] if isinstance(errors['email'], list) else str(errors['email'])
            if 'required' in email_error.lower():
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            elif 'valid' in email_error.lower():
                return Response({'error': 'Please enter a valid email address'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': email_error}, status=status.HTTP_400_BAD_REQUEST)
        
        if 'password' in errors:
            password_error = errors['password'][0] if isinstance(errors['password'], list) else str(errors['password'])
            if 'required' in password_error.lower():
                return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': password_error}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generic error for other validation issues
        return Response({'error': 'Please check your email and password'}, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    # Check if user exists
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user_exists = User.objects.filter(email=email).exists()
        if not user_exists:
            return Response({
                'error': 'No account found with this email address'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception:
        pass
    
    user = authenticate(request, email=email, password=password)
    
    if user is not None:
        if not user.is_active:
            return Response({
                'error': 'Your account has been deactivated'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Merge guest cart to user cart
        session_id = request.session.session_key
        if session_id:
            try:
                from shop.api.cart import merge_guest_cart_to_user
                merge_guest_cart_to_user(user, session_id)
            except Exception as e:
                pass  # Silently handle merge errors
        
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        
        return Response({
            'message': 'Login successful',
            'user': user_data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error': 'Incorrect password. Please try again'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get current authenticated user information
    """
    user_data = UserSerializer(request.user).data
    return Response({
        'user': user_data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    """
    Logout user (client-side should remove tokens)
    """
    return Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)

