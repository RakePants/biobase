import sys
from os.path import dirname as up

project_dir = up(up(up(__file__)))
sys.path.append(project_dir)

import pandas as pd
import psycopg2
from backend.src.config import DB_HOST, DB_NAME, DB_PASS, DB_USER

# пытаемся подключиться к базе данных
try:
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    cur = conn.cursor()
    
    print('Connected to already existing database')
except psycopg2.OperationalError:
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS
    )
    cur = conn.cursor()
    
    cur.execute(f"CREATE DATABASE {DB_NAME}")
    conn.commit()
    cur.execute(f"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER}")
    conn.commit()
    print("Database created")
    
    
df = pd.read_csv("baa_info.csv")
try:
    cur.execute("""
        CREATE TABLE names (
            name varchar PRIMARY KEY
        )
    """)
    conn.commit()
except psycopg2.errors.DuplicateTable:
    print("Table already exists, skipping...")
    pass
    

for name in df['name']:
    try:
        cur.execute("INSERT INTO names (name) VALUES (%s)", (name,))
        conn.commit()
    except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
        cur.execute("ROLLBACK")
        conn.commit()
        pass

cur.close()
conn.close()  # закрываем соединение
