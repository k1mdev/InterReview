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

def save_attempt(uuid, question, answer, feedback, user_id, created):
    conn = get_connection()
    with conn.cursor() as cur:
        query = """
            INSERT INTO Attempt (attempt_id, question, answer, feedback, user_id, created) VALUES (%s, %s, %s, %s, %s);
        """
        cur.execute(query, (uuid, question, answer, feedback, user_id, created))
    conn.commit()

def get_attempts_by_user_id(user_id):
    conn = get_connection()
    with conn.cursor() as cur:
        query = """
            SELECT * FROM Attempt WHERE user_id = %s ORDER BY timestamp DESC;
        """
        cur.execute(query, (user_id))
        return cur.fetchall()

def get_attempt_by_id(attempt_id):
    conn = get_connection()
    with conn.cursor() as cur:
        query = """
            SELECT * FROM Attempt WHERE attempt_id = %s;
        """
        cur.execute(query, (attempt_id))
        return cur.fetchone()
    