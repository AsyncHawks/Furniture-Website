from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class JWTAuthenticationSafe(JWTAuthentication):
    """
    Custom JWT Authentication that doesn't raise exceptions for invalid tokens.
    This allows endpoints with AllowAny permission to work even when invalid tokens are sent.
    """
    
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, AuthenticationFailed):
            # Return None instead of raising exception
            # This allows the request to proceed and be handled by permission classes
            return None
