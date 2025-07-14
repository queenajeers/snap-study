from firebase_config import bucket,db
import requests
from tasks import process_the_source


def processFiles(uid, project_id):
    print(f"[INFO] Fetching sources for user '{uid}', project '{project_id}'...")

    sources_path = f"users/{uid}/projects/{project_id}/sources"
    sources_ref = db.reference(sources_path)
    sources_data = sources_ref.get()

    if not sources_data:
        print(f"[WARNING] No sources found at: {sources_path}")
        return

  
    for source_id, source_info in sources_data.items():
        download_url = source_info.get("downloadURL")
        if download_url:
            print(f"Started processing")
            process_the_source.delay(uid,project_id,source_id,download_url)
        else:
            print("Did not find any URL at source")
            
            

        

processFiles("4kZq0XhY7xYiBksTnRz2zbAT6cn2","-OUt3HQbvQ4yOMkEbuvw")