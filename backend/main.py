import psycopg2
import fastapi
import uvicorn
from fastapi import FastAPI, Body, APIRouter
from pyaspeller import YandexSpeller
from starlette.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

speller = YandexSpeller()


try:
    # пытаемся подключиться к базе данных
    conn = psycopg2.connect(dbname='bio', user='postgres', password='postgres', host='localhost', port='5432')
    conn = psycopg2.connect(dbname='bio', user='postgres', password='postgres', host='localhost', port='5432')
    cursor = conn.cursor()
    print('Connected to the database')
except:
    # в случае сбоя подключения будет выведено сообщение в STDOUT
    print('Can`t establish connection to database')

app = FastAPI()


@app.post("/search")
async def search(data = Body()):

    request = data['request']
    fixed = speller.spelled(request)
    print(fixed)
    cursor.execute(f"select name from names where lower(name) like lower('%{fixed}%') ORDER BY names.name")
    all_names = cursor.fetchall()
    print(all_names)
    return JSONResponse({"text": all_names})

@app.post("/update")
def update(data = Body()):

    name = data["name"]
    new_name = data["new_name"]
    cursor.execute(f"UPDATE names SET name = '{new_name}' WHERE name = '{name}'")
    conn.commit()

@app.post("/delete")
def update(data = Body()):
    names = data["name"]
    for name in names:
        cursor.execute(f"DELETE FROM names WHERE name = '{name}'")
    conn.commit()

@app.post("/add")
def add(data = Body()):
    name = data["name"]
    cursor.execute(f"INSERT INTO names (name) VALUES ('{name}')")
    conn.commit()


# app.mount("/", StaticFiles(directory="../frontend/static",html=True),name = "static")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=1337)