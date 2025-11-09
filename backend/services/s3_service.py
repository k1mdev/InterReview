from io import BytesIO
import boto3
import base64

s3 = boto3.client('s3')
BUCKET_NAME = "interreview-audio-storage"

def upload_audio(file, uuid, user_id):
    """
    Saves audio clip to bucket.

    Parameters:
        file (FileStorage): The audio clip.
        uuid (UUID): The UUID of the audio file.
        user_id (str): The user ID who generated this recording.
    """
    s3.upload_fileobj(
        Fileobj=file,
        Bucket=BUCKET_NAME,
        Key=f"{user_id}/{uuid}" 
    )

def get_audio(uuid, user_id):
    """
    Fetches an audio clip from the bucket and returns it as a base64 encoded string.
    
    Parameters:
        uuid (UUID): The UUID of the audio file.
        user_id (str): The user ID who generated this recording.
        
    Returns:
        str: Base64 encoded audio data with mime type prefix
    """
    try:
        buffer = BytesIO()
        s3.download_fileobj(
            BUCKET_NAME,
            f"{user_id}/{uuid}",
            buffer
        )
        file_content = buffer.getvalue()
        encoded = base64.b64encode(file_content).decode('utf-8')
        return f"data:audio/mpeg;base64,{encoded}"
    except Exception as e:
        raise Exception(f"Error fetching file from S3: {e}")
    
def delete_audio(uuid, user_id):
    """
    Deletes an audio clip from the S3 bucket.

    Parameters:
        uuid (UUID): The UUID of the audio file.
        user_id (str): The user ID who generated this recording.
    """
    try:
        s3.delete_object(
            Bucket=BUCKET_NAME,
            Key=f"{user_id}/{uuid}"
        )
    except Exception as e:
        raise Exception(f"Error deleting file from S3: {e}")