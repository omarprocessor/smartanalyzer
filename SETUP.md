# Quick Setup Guide for Smart Analyzer

## Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again!)

## Step 2: Create .env File

In the root directory (`/home/elprocessor/smartanalyzer/`), create a file named `.env` with the following content:

```env
# Required
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional Django settings (defaults provided)
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Required:**
- `OPENAI_API_KEY`: Your OpenAI API key (replace `sk-your-actual-api-key-here` with your actual key)

**Optional:**
- `DEBUG`: Set to `True` or `False` (defaults to `True`)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts (defaults to empty list)

**Note:** The Django `SECRET_KEY` is configured directly in `backend/settings.py` and does not need to be set in `.env`.

## Step 3: Start the Application

### Option A: Use the start script
```bash
./start.sh
```

### Option B: Start manually

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## Troubleshooting

### "OPENAI_API_KEY not found" error
- Make sure you created the `.env` file in the root directory
- Check that the file contains `OPENAI_API_KEY=your_key` (no quotes needed)
- Restart the Django server after creating/updating `.env`

### CORS errors
- Make sure the backend is running on port 8000
- Check that `CORS_ALLOWED_ORIGINS` in `backend/settings.py` includes your frontend URL

### Frontend not connecting to backend
- Verify Django server is running: `python manage.py runserver`
- Check the API URL in `frontend/app/page.tsx` matches your backend URL
- Look for errors in browser console (F12)

