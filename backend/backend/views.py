import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
def contact_view(request):
    """
    Get data from react form and validate it and than send it
    to webhook url.
    """
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip()
    phone = request.data.get('phone', '').strip()
    message = request.data.get('message', '').strip()

    # Basic validation
    if not name or not email or not message:
        return Response(
            {"error": "Name, email and message are mandatory."},
            status=status.HTTP_400_BAD_REQUEST
        )

    payload = {
        "name": name,
        "email": email,
        "phone": phone,
        "message": message,
    }
    '''Web url loading'''
    try:
        n8n_response = requests.post(
            settings.N8N_CONTACT_WEBHOOK_URL,
            json=payload,
            timeout=10
        )
        n8n_response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("N8N ERROR:", e)
        return Response(
            {"error": "Failed to send message! Please try later."},
            status=status.HTTP_502_BAD_GATEWAY
        )

    return Response(
        {"success": True, "message": "Message sent successfully."},
        status=status.HTTP_200_OK
    )