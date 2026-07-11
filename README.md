# Contact Form → CRM Automation

A lightweight lead-capture system that connects a **React** contact form to a **Django** API, which forwards submissions to an **n8n** workflow for automated processing (Google Sheets logging, email notifications).

## Architecture

```
React (Vite)  →  Django API  →  n8n Webhook  →  Google Sheets / Gmail
```

- **React** — renders the contact form and sends form data to the Django backend.
- **Django** — validates incoming data and forwards it to n8n. No database model or serializer is used; Django acts purely as a pass-through/validation layer.
- **n8n** — receives the forwarded data via a Webhook node and handles downstream automation (saving to Google Sheets, sending emails).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, lucide-react |
| Backend | Django, Django REST Framework, django-cors-headers, requests |
| Automation | n8n (self-hosted via Docker) |

## Project Structure

```
project/
├── backend/
│   ├── <app>/
│   │   ├── views.py          # contact_view — validates + forwards to n8n
│   │   └── urls.py           # /api/contact/ route
│   └── settings.py           # CORS, DRF, N8N_CONTACT_WEBHOOK_URL
└── frontend/
    └── src/
        ├── App.jsx            # routing
        └── pages/
            └── ContactPage.jsx  # contact form UI
```

## Setup

### 1. Backend (Django)

```bash
pip install djangorestframework django-cors-headers requests
```

In `settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... rest of middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

N8N_CONTACT_WEBHOOK_URL = "http://localhost:5678/webhook/<your-webhook-id>"
```

Add the route in `urls.py`:

```python
path('api/contact/', views.contact_view, name='contact-api'),
```

Run the server:

```bash
python manage.py runserver
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite lucide-react react-router-dom
npm run dev
```

In `ContactPage.jsx`, confirm the API endpoint points to your Django server:

```javascript
const API_URL = "http://127.0.0.1:8000/api/contact/";
```

### 3. n8n Workflow

1. Add a **Webhook** node:
   - HTTP Method: `POST`
   - Respond: `Immediately`
2. Add a **Google Sheets** node (Append Row) after the Webhook to log leads.
   - Map fields using `{{ $json.body.name }}`, `{{ $json.body.email }}`, `{{ $json.body.phone }}`, `{{ $json.body.message }}`
3. **Publish** the workflow — the production Webhook URL only works once the workflow is published/active.
4. Copy the **Production URL** into `N8N_CONTACT_WEBHOOK_URL` in Django's `settings.py`.

## How It Works

1. User fills out the form on the React contact page.
2. On submit, React sends a POST request to Django's `/api/contact/` endpoint.
3. Django validates that `name`, `email`, and `message` are present.
4. Django forwards the payload to the n8n Production Webhook URL using `requests.post()`.
5. n8n receives the data and appends it as a new row in Google Sheets (and can also trigger email notifications).
6. Django returns a success/error response back to React, which updates the UI accordingly.

## Testing Notes

- Production webhook calls **do not appear on the n8n canvas** — check the **Executions** tab to view received data.
- Confirm you're viewing the correct execution: production calls show `"executionMode": "production"` and use the `webhook/...` path (not `webhook-test/...`).
- If Django returns a `502 Bad Gateway`, check the terminal for the underlying `requests` exception — usually caused by:
  - Workflow not published
  - Incorrect webhook URL in `settings.py`
  - HTTP method mismatch (Webhook node must be set to POST)

## Known Limitations / Next Steps

- [ ] Add Gmail node in n8n for auto-reply to the client and internal notification
- [ ] Add rate-limiting/spam protection on the Django endpoint
- [ ] Move `N8N_CONTACT_WEBHOOK_URL` and other secrets into environment variables (`.env`) instead of hardcoding in `settings.py`
- [ ] Loading/disabled submit states already implemented in the React form (`status: idle | sending | success | error`)

## Author

Arham Rao — Django backend developer, AI Automation freelancer
