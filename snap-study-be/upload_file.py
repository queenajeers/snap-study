from firebase_config import bucket

def upload_user_file(local_path,uid,project_name, filename):
    blob = bucket.blob(f'users/{uid}/{project_name}/{filename}')
    blob.upload_from_filename(local_path)
    return blob.public_url


