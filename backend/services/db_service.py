import psycopg2
import os
from dotenv import load_dotenv
from flask import g


def get_connection():
    load_dotenv()
    if 'db_conn' not in g:
        g.db_conn = psycopg2.connect(
            host=os.getenv('INTERREVIEW_DB_ENDPOINT'),
            port=5432,
            database="postgres",
            user=os.getenv('INTERREVIEW_DB_USER'),
            password=os.getenv('INTERREVIEW_DB_PASSWORD')
        )
    return g.db_conn

def post_attempt(data):
    conn = get_connection()
    with conn.cursor() as cur:
        question = data.question
        answer = data.answer
        feedback = data.feedback
        s3_url = data.s3_url
        uid = data.uid
        created = data.created
        query = """
            INSERT INTO Attempt (question, answer, feedback, uid, created, s3_url) VALUES (%s, %s, %s, %s, %s, %s);
        """
        cur.execute(query, (question, answer, feedback, s3_url, uid, created))
    conn.commit()