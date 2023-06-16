from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, insert, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.orm import load_only
from starlette.responses import JSONResponse

from backend.src.database import get_async_session
from backend.src.operations.models import names
from backend.src.operations.schemas import ChangeNames, SearchName, DeleteName, AddName

from pyaspeller import YandexSpeller

speller = YandexSpeller()

router = APIRouter(
    prefix="",
    tags=["Operation"]
)


@router.post("/search")
async def search_name(name: SearchName, session: AsyncSession = Depends(get_async_session)):
    fixed_name = speller.spelled(name.request)
    query = select(names.c.name).where(func.lower(names.c.name).like(func.lower(f"%{fixed_name}%")))
    print(query)
    result = await session.execute(query)
    names_from_result = [tuple(el) for el in result.all()]
    return JSONResponse({"text": names_from_result})


@router.post("/update")
async def update_name(data: ChangeNames, session: AsyncSession = Depends(get_async_session)):
    old_name = data.name
    new_name = data.new_name
    smtm = update(names).where(names.c.name == old_name).values(name=new_name)
    await session.execute(smtm)
    await session.commit()
    return {"status": "success"}

@router.post("/add")
async def add_name(request: AddName, session: AsyncSession = Depends(get_async_session)):
    smtm = insert(names).values(name=request.name)
    await session.execute(smtm)
    await session.commit()

    return {"status": "success"}

@router.post("/delete")
async def delete_name(request: DeleteName, session: AsyncSession = Depends(get_async_session)):
    names_list = request.name

    for name in names_list:
        smtm = delete(names).where(names.c.name == name)
        await session.execute(smtm)
        await session.commit()

    return {"status": "success"}

# @app.post("/delete")
# def update(data = Body()):
#     names = data["name"]
#     for name in names:
#         cursor.execute(f"DELETE FROM names WHERE name = '{name}'")
#     conn.commit()
#
# @app.post("/add")
# def add(data = Body()):
#     name = data["name"]
#     cursor.execute(f"INSERT INTO names (name) VALUES ('{name}')")
#     conn.commit()

# @router.post("/")
# async def add_specific_operations(new_operation: OperationCreate, session: AsyncSession = Depends(get_async_session)):
#     stmt = insert(operation).values(**new_operation.dict())
#     await session.execute(stmt)
#     await session.commit()
#     return {"status": "success"}
