import firebase_admin
from firebase_admin import credentials,storage,db


DATABASE_URL = "https://medicalstudytool-default-rtdb.asia-southeast1.firebasedatabase.app/"

if not firebase_admin._apps:
    cred = credentials.Certificate("private/medicalstudytool-firebase-adminsdk-fbsvc-606df84700.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'medicalstudytool.firebasestorage.app',
        'databaseURL':DATABASE_URL,
    })

bucket = storage.bucket()
