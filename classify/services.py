import os
from openai import OpenAI
from django.conf import settings


def generate_recommendations(profile_data):
    """
    Generate course recommendations using OpenAI based on user profile.
    
    Args:
        profile_data: Dictionary containing user's academic profile, interests, and personality
        
    Returns:
        List of recommended courses with descriptions
    """
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    # Build the prompt for OpenAI
    prompt = f"""You are an expert academic counselor helping a high school student find the perfect course or degree program.

Student Profile:
- Subjects studied: {', '.join(profile_data.get('subjects', []))}
- Favorite subjects: {', '.join(profile_data.get('favorite_subjects', []))}
- Grades: {profile_data.get('grades', {})}
- Hobbies: {', '.join(profile_data.get('hobbies', []))}
- Interests: {', '.join(profile_data.get('interests', []))}
- Personality Type: {profile_data.get('personality_type', 'Not specified')}

Based on this comprehensive profile, recommend 8-10 specific degree programs or training courses that would be an excellent fit. Consider:
1. Academic strengths and performance
2. Genuine interests and passions
3. Personality traits and working style
4. Alignment between hobbies and potential careers

For each recommendation, provide:
- Course/Degree name
- Brief description (2-3 sentences)
- Why it's a good fit (1-2 sentences)
- Potential career paths

Format your response as a JSON array of objects with keys: "name", "description", "fit_reason", "career_paths".

Return ONLY the JSON array, no additional text."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful academic counselor. Always respond with valid JSON arrays."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Extract the recommendations from the response
        recommendations_text = response.choices[0].message.content.strip()
        
        # Try to parse JSON (handle cases where response might have markdown code blocks)
        if recommendations_text.startswith('```'):
            # Remove markdown code blocks
            recommendations_text = recommendations_text.split('```')[1]
            if recommendations_text.startswith('json'):
                recommendations_text = recommendations_text[4:]
            recommendations_text = recommendations_text.strip()
        
        import json
        recommendations = json.loads(recommendations_text)
        
        # Ensure it's a list
        if isinstance(recommendations, dict):
            recommendations = [recommendations]
        
        return recommendations
        
    except Exception as e:
        # Fallback recommendations if OpenAI fails
        return [
            {
                "name": "General Studies",
                "description": "A flexible program allowing exploration of multiple fields.",
                "fit_reason": "Based on your diverse interests, this provides flexibility to find your passion.",
                "career_paths": ["Various fields based on specialization"]
            }
        ]

