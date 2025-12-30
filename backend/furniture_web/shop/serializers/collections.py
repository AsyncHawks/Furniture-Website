from rest_framework import serializers
from shop.models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    title = serializers.CharField(source='name')
    link = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'title', 'link', 'image']
    
    def get_link(self, obj):
        return f'/collections/{obj.slug}'
