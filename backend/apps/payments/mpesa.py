"""
M-Pesa Daraja API integration for TechZone.
Supports STK Push (Lipa Na M-Pesa Online) for checkout.
"""
import base64
import requests
from datetime import datetime


def _cfg() -> dict:
    """
    Load M-Pesa config from the StoreSettings singleton.
    Imported here (not at module level) to avoid circular imports
    and to always reflect the latest saved settings.
    """
    from apps.accounts.models import StoreSettings
    s = StoreSettings.load()
    return {
        "env":       s.mpesa_environment,
        "key":       s.mpesa_consumer_key,
        "secret":    s.mpesa_consumer_secret,
        "shortcode": s.mpesa_shortcode,
        "passkey":   s.mpesa_passkey,
        "callback":  s.mpesa_callback_url,
    }


def get_mpesa_access_token() -> str:
    """Get OAuth access token from Safaricom."""
    cfg = _cfg()
    url = (
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        if cfg["env"] == "sandbox"
        else "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    )
    credentials = base64.b64encode(
        f"{cfg['key']}:{cfg['secret']}".encode()
    ).decode()

    response = requests.get(
        url,
        headers={"Authorization": f"Basic {credentials}"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json().get("access_token")


def generate_password() -> tuple[str, str]:
    """Generate STK push password and timestamp."""
    cfg = _cfg()
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    raw = f"{cfg['shortcode']}{cfg['passkey']}{timestamp}"
    password = base64.b64encode(raw.encode()).decode()
    return password, timestamp


def stk_push(phone_number: str, amount: int, order_number: str, description: str = "TechZone Order") -> dict:
    """
    Initiate an STK push to a customer's phone.

    Args:
        phone_number: Customer's phone in format 254XXXXXXXXX
        amount: Amount in KES (integer)
        order_number: Order reference number
        description: Transaction description shown on phone

    Returns:
        dict: Safaricom API response
    """
    cfg = _cfg()
    base_url = (
        "https://sandbox.safaricom.co.ke"
        if cfg["env"] == "sandbox"
        else "https://api.safaricom.co.ke"
    )

    access_token = get_mpesa_access_token()
    password, timestamp = generate_password()

    payload = {
        "BusinessShortCode": cfg["shortcode"],
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": cfg["shortcode"],
        "PhoneNumber": phone_number,
        "CallBackURL": cfg["callback"],
        "AccountReference": order_number,
        "TransactionDesc": description,
    }

    response = requests.post(
        f"{base_url}/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def query_stk_push(checkout_request_id: str) -> dict:
    """Query the status of an STK push transaction."""
    cfg = _cfg()
    base_url = (
        "https://sandbox.safaricom.co.ke"
        if cfg["env"] == "sandbox"
        else "https://api.safaricom.co.ke"
    )

    access_token = get_mpesa_access_token()
    password, timestamp = generate_password()

    payload = {
        "BusinessShortCode": cfg["shortcode"],
        "Password": password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id,
    }

    response = requests.post(
        f"{base_url}/mpesa/stkpushquery/v1/query",
        json=payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()