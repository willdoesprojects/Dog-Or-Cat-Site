import gdown
import os

def download_file_from_google_drive(file_id, file_name):
    # Ensure the destination directory exists
    destination = os.path.join("models", file_name)
    os.makedirs(os.path.dirname(destination), exist_ok=True)

    # Construct the Google Drive URL and use gdown to download the file
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    gdown.download(url, destination, quiet=False)

