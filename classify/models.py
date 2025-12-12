from django.db import models
import json


class UserProfile(models.Model):
    """Model to store user academic profile and preferences"""
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Academic Information
    subjects = models.JSONField(default=list, help_text="List of high school subjects")
    grades = models.JSONField(default=dict, help_text="Dictionary of subject:grade pairs")
    favorite_subjects = models.JSONField(default=list, help_text="Subjects the user enjoyed most")
    
    # Interests and Activities
    hobbies = models.JSONField(default=list, help_text="List of hobbies and extracurricular activities")
    interests = models.JSONField(default=list, help_text="Topics and areas of interest")
    
    # Personality Test (Myers-Briggs)
    personality_type = models.CharField(max_length=4, blank=True, help_text="MBTI personality type (e.g., INTJ, ENFP)")
    personality_scores = models.JSONField(default=dict, help_text="Detailed personality test scores")
    
    # Recommendations
    recommendations = models.JSONField(default=list, help_text="Generated course recommendations")
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Profile {self.id} - {self.personality_type or 'No Type'}"
