from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserProfileSerializer, ClassifyRequestSerializer
from .services import generate_recommendations


@api_view(['POST'])
def classify(request):
    """
    Main endpoint to receive user profile and generate recommendations.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # Log incoming request
    logger.info(f"Received classify request")
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request data: {request.data}")
    logger.info(f"Request content type: {request.content_type}")
    
    try:
        serializer = ClassifyRequestSerializer(data=request.data)
    except Exception as e:
        logger.error(f"Error creating serializer: {str(e)}")
        return Response(
            {'error': f'Error processing request: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not serializer.is_valid():
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(
            {'error': 'Invalid data provided', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if OpenAI API key is configured
    from django.conf import settings
    if not settings.OPENAI_API_KEY:
        logger.error("OPENAI_API_KEY not configured")
        return Response(
            {'error': 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Save the profile
    try:
        profile = UserProfile.objects.create(**serializer.validated_data)
        logger.info(f"Created profile with ID: {profile.id}")
    except Exception as e:
        logger.error(f"Error creating profile: {str(e)}")
        return Response(
            {'error': f'Failed to save profile: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Generate recommendations using OpenAI
    try:
        logger.info("Generating recommendations with OpenAI...")
        recommendations = generate_recommendations(serializer.validated_data)
        profile.recommendations = recommendations
        profile.save()
        logger.info(f"Successfully generated {len(recommendations)} recommendations")
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Failed to generate recommendations: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Return the profile with recommendations
    response_serializer = UserProfileSerializer(profile)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def profile_list(request):
    """
    Get list of all profiles (for testing/admin purposes).
    """
    profiles = UserProfile.objects.all()
    serializer = UserProfileSerializer(profiles, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def profile_detail(request, pk):
    """
    Get a specific profile by ID.
    """
    try:
        profile = UserProfile.objects.get(pk=pk)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint to verify the API is working.
    """
    from django.conf import settings
    return Response({
        'status': 'ok',
        'message': 'API is working',
        'openai_configured': bool(settings.OPENAI_API_KEY),
    }, status=status.HTTP_200_OK)
