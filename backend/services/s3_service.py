from io import BytesIO
import boto3

s3 = boto3.client('s3')
BUCKET_NAME = "interreview-audio-storage"

def upload_audio(file, uuid, user_id):
    """
    Saves audio clip to bucket.

    Parameters:
        uuid (UUID): The UUID of the audio file.
        user_id (str): The user ID who generated this recording.
    """
    s3.upload_file(
        Fileobj=file,
        Bucket=BUCKET_NAME,
        Key=f"{user_id}/{uuid}" 
    )

def get_audio(uuid, user_id):
    """
    Fetches an audio clip from the bucket.
    
    Parameters:
        uuid (UUID): The UUID of the audio file.
        user_id (str): The user ID who generated this recording.
    """
    try:
        buffer = BytesIO()
        s3.download_fileobj(
            BUCKET_NAME,
            f"{user_id}/{uuid}",
            buffer
        )
        file_content = buffer.getvalue()
        return file_content
    except Exception as e:
        raise Exception("Error fetching file from S3: {e}")