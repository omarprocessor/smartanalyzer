# Smart Analyzer - Course Recommendation Platform

Smart Analyzer is a smart course-recommendation platform that helps students discover the perfect degree or training programs based on their academic profile, interests, and personality.

## Features

- **Academic Profile Collection**: Input your high school subjects, grades, and favorite subjects
- **Interest Tracking**: Add hobbies and areas of interest
- **Personality Assessment**: Complete a Myers-Briggs based personality test
- **AI-Powered Recommendations**: Get personalized course recommendations using OpenAI
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Backend
- Django 6.0
- Django REST Framework
- OpenAI API
- SQLite (default database)

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+ (20+ recommended)
- OpenAI API Key

### Backend Setup

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional Django settings (defaults provided)
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```
   
   **Note:** Copy `.env.example` to `.env` and fill in your values, or create `.env` manually with at minimum the `OPENAI_API_KEY`.

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```
   The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Fill in your academic information:
   - Add subjects you studied
   - Set grades for each subject
   - Mark your favorite subjects
   - Add hobbies and interests
3. Complete the personality test (12 questions)
4. Click "Analyze" to get your personalized recommendations
5. Review your course recommendations

## API Endpoints

- `POST /api/classify/` - Submit profile and get recommendations
- `GET /api/profiles/` - List all profiles
- `GET /api/profiles/<id>/` - Get specific profile

## Project Structure

```
smartanalyzer/
├── backend/           # Django project settings
├── classify/          # Django app (models, views, services)
├── frontend/          # Next.js application
│   ├── app/          # Next.js app directory
│   └── components/   # React components
├── manage.py         # Django management script
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Notes

- The platform uses OpenAI's GPT-4o-mini model for generating recommendations
- All user profiles are stored in the database
- CORS is configured to allow requests from `localhost:3000`

## License

This project is open source and available for educational purposes.

