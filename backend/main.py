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
    conn = psycopg2.connect(dbname='bio', user='postgres', password='postgres3', host='localhost', port='5432')
    cursor = conn.cursor()
except:
    # в случае сбоя подключения будет выведено сообщение в STDOUT
    print('Can`t establish connection to database')

app = FastAPI()


@app.post("/search")
async def search(data = Body()):

    print(data)
    request = data['request']
    print(request)
    fixed = speller.spelled(request)
    print(fixed)
    cursor.execute(f"select name from names where lower(name) like lower('%{fixed}%')")
    all_names = cursor.fetchall()
    print(all_names)
    return JSONResponse({"text": all_names})

@app.get("/update")
def update(data = Body()):

    name = data["name"]
    print(name)
    new_name = data["new_name"]
    cursor.execute(f"UPDATE names SET name = '{new_name}' WHERE name = '{name}'")
    conn.commit()


# app.mount("/", StaticFiles(directory="static",html=True),name = "static") - не работает, надо исправить

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)