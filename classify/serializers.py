from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'recommendations']


class ClassifyRequestSerializer(serializers.Serializer):
    """Serializer for classification request"""
    subjects = serializers.ListField(child=serializers.CharField())
    grades = serializers.DictField(child=serializers.CharField())
    favorite_subjects = serializers.ListField(child=serializers.CharField())
    hobbies = serializers.ListField(child=serializers.CharField())
    interests = serializers.ListField(child=serializers.CharField())
    personality_type = serializers.CharField(max_length=4, required=False, allow_blank=True)
    personality_scores = serializers.DictField(required=False, allow_empty=True)

