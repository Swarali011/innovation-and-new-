import os
import firebase_admin
from firebase_admin import auth, credentials
from config import settings
from logging_config import logger

# Initialize Firebase Admin SDK if credentials file exists
if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)
    logger.info("Firebase Admin SDK initialized successfully")
else:
    logger.info("Firebase credentials path not set or file not found. Running in token fallback mode.")

def verify_firebase_token(id_token: str) -> dict:
    """Verify Firebase JWT token or fallback to dev token payload."""
    try:
        if firebase_admin._apps:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        
        # Development fallback token parser
        return {
            "uid": id_token if id_token.startswith("usr-") else "usr-default",
            "email": "prachi.swarali@dypatil.edu",
            "name": "Prachi & Swarali",
            "picture": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        }
    except Exception as e:
        logger.error(f"Firebase token verification failed: {str(e)}")
        raise ValueError("Invalid authentication token")
