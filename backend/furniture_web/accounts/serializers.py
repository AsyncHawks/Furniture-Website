from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ('email', 'full_name', 'username', 'password', 'confirm_password')
        extra_kwargs = {
            'full_name': {'required': False},
            'email': {'required': True}
        }
    
    def validate(self, attrs):
        # Map username to full_name if provided
        if 'username' in attrs:
            attrs['full_name'] = attrs.pop('username')
        
        # Ensure either username or full_name is provided
        if not attrs.get('full_name'):
            raise serializers.ValidationError({
                "full_name": "Either username or full_name is required."
            })
        
        # Only validate password match if confirm_password is provided
        if 'confirm_password' in attrs:
            if attrs['password'] != attrs['confirm_password']:
                raise serializers.ValidationError({
                    "confirm_password": "Password fields didn't match."
                })
        return attrs
    
    def create(self, validated_data):
        """Create a new user"""
        validated_data.pop('confirm_password', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details"""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')
