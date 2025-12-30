from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from shop.models import Category
from shop.serializers import CategorySerializer


# ==================== CATEGORIES ====================

@swagger_auto_schema(
    method='get',
    operation_description="Get list of all furniture categories",
    operation_id="list_categories",
    tags=['Categories'],
    responses={
        200: openapi.Response(
            description="List of categories",
            examples={
                "application/json": [
                    {
                        "id": 1,
                        "title": "Bed Sets",
                        "link": "/categories/bed-sets",
                        "image": "https://example.com/beds.jpg"
                    },
                    {
                        "id": 2,
                        "title": "Sofas",
                        "link": "/categories/sofas",
                        "image": "https://example.com/sofas.jpg"
                    }
                ]
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    """Get all active categories"""
    categories = Category.objects.filter(is_active=True)
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    operation_description="Get a single category by ID or slug",
    operation_id="get_category",
    tags=['Categories'],
    manual_parameters=[
        openapi.Parameter(
            'id_or_slug',
            openapi.IN_PATH,
            description="Category ID or slug",
            type=openapi.TYPE_STRING,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Category details",
            examples={
                "application/json": {
                    "id": 1,
                    "title": "Bed Sets",
                    "link": "/categories/bed-sets",
                    "image": "https://example.com/beds.jpg"
                }
            }
        ),
        404: openapi.Response(
            description="Category not found",
            examples={
                "application/json": {
                    "detail": "Not found."
                }
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def category_detail(request, id_or_slug):
    """Get category by ID or slug"""
    try:
        if id_or_slug.isdigit():
            category = get_object_or_404(Category, id=id_or_slug, is_active=True)
        else:
            category = get_object_or_404(Category, slug=id_or_slug, is_active=True)
    except:
        return Response(
            {"detail": "Category not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CategorySerializer(category)
    return Response(serializer.data, status=status.HTTP_200_OK)
