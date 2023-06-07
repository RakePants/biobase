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
    conn = psycopg2.connect(dbname='bio', user='postgres', password='123', host='127.0.0.1')
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


app.mount("/", StaticFiles(directory="static",html=True),name = "static")



# def update():
#
#     cursor.execute("UPDATE names SET name = 'Сашокчек' WHERE card_id = 'f01abdfe-6980-4b3c-a5c1-416acf1b06bc'")
#     conn.commit()




if __name__ == '__main__':
    uvicorn.run(app=app, port=80)