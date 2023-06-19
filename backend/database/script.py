import sys
from os.path import dirname as up

project_dir = up(up(up(__file__)))
sys.path.append(project_dir)

import pandas as pd
import psycopg2
from backend.src.config import DB_HOST, DB_NAME, DB_PASS, DB_USER, DB_PORT

# пытаемся подключиться к базе данных
try:
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    conn.autocommit = True
    cur = conn.cursor()
    print('Connected to already existing database')
    
except:
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute(f"CREATE DATABASE {DB_NAME}")
    cur.execute(f"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER}")
    print("Database created")
    cur.close()
    conn.close()
        
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT,
        database=DB_NAME
    )
    conn.autocommit = True
    cur = conn.cursor()
    
    print("Connected to newly created database")
    

df = pd.read_csv("baa_info.csv")

try:
    cur.execute("""
        CREATE TABLE baa (
            name varchar PRIMARY KEY
        )
    """)
    cur.execute(f"GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO {DB_USER}")
    print("Created new table 'baa'")
except psycopg2.errors.DuplicateTable:
    cur.execute(f"TRUNCATE TABLE baa")
    print("Table already exists, cleaning...")


    
for name in df['name']:
    try:
        cur.execute("INSERT INTO baa (name) VALUES (%s)", (name,))
    except (psycopg2.errors.UniqueViolation):
        cur.execute("ROLLBACK")
        pass

cur.close()
conn.close()  # закрываем соединение
