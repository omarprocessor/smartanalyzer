from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'personality_type', 'created_at']
    list_filter = ['personality_type', 'created_at']
    search_fields = ['personality_type']
    readonly_fields = ['created_at']
