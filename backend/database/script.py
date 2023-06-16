import pandas as pd
import psycopg2


try:
    # пытаемся подключиться к базе данных
    conn = psycopg2.connect(dbname='bio', user='postgres', password='postgres', host='127.0.0.1')
    cursor = conn.cursor()
except:
    # в случае сбоя подключения будет выведено сообщение в STDOUT
    print('Can`t establish connection to database')
    
df = pd.read_csv("baa_info.csv")

cur = conn.cursor()
try:
    cur.execute("""
        CREATE TABLE names (
            name varchar PRIMARY KEY
        )
    """)
    conn.commit()
except psycopg2.errors.DuplicateTable:
    print("Table already exists, skipping")
    pass
    

for name in df['name']:
    try:
        cur.execute("INSERT INTO names (name) VALUES (%s)", (name,))
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        cur.execute("ROLLBACK")
        conn.commit()
        pass

cursor.close()
conn.close()  # закрываем соединение
