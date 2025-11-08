import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv('INTERREVIEW_DB_ENDPOINT'),
    port=5432,
    database="postgres",
    user=os.getenv('INTERREVIEW_DB_USER'),
    password=os.getenv('INTERREVIEW_DB_PASSWORD')
)

cur = conn.cursor()
cur.execute("SELECT version();")
print("Connected to:", cur.fetchone())

cur.close()
conn.close()