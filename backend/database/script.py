import pandas as pd
import psycopg2

try:
    # пытаемся подключиться к базе данных
    conn = psycopg2.connect(dbname='bio', user='postgres', password='123', host='127.0.0.1')
    cursor = conn.cursor()
except:
    # в случае сбоя подключения будет выведено сообщение в STDOUT
    print('Can`t establish connection to database')


df = pd.read_csv("info_about_baa (2).csv")
for i in range(len(df)):
    row = df.iloc[i].to_list()
    sql = f"INSERT INTO names (id, name) VALUES ({row[0]}, %s);"
    value = row[1]
    cursor.execute(sql, (value,))
conn.commit()


cursor.close()
conn.close() # закрываем соединение

