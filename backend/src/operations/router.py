import sys
from os.path import dirname as up

project_dir = up(up(up(up(__file__))))
sys.path.append(project_dir)

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
    try:
        fixed_name = speller.spelled(name.request)
        query = select(names.c.name).where(func.lower(names.c.name).like(func.lower(f"%{fixed_name}%")))
        result = await session.execute(query)
        names_from_result = [tuple(el) for el in result.all()]
        return JSONResponse({"text": names_from_result, "status": "success"})

    except:
        return {"status": "error"}


@router.post("/update")
async def update_name(data: ChangeNames, session: AsyncSession = Depends(get_async_session)):
    try:
        old_name = data.name
        new_name = data.new_name
        smtm = update(names).where(names.c.name == old_name).values(name=new_name)
        await session.execute(smtm)
        await session.commit()
        return {"status": "success"}
    except:
        return {"status": "error"}


@router.post("/add")
async def add_name(request: AddName, session: AsyncSession = Depends(get_async_session)):
    try:
        smtm = insert(names).values(name=request.name)
        await session.execute(smtm)
        await session.commit()
        return {"status": "success"}
    except:
        return {"status": "error"}


@router.post("/delete")
async def delete_name(request: DeleteName, session: AsyncSession = Depends(get_async_session)):
    try:
        names_list = request.name
        for name in names_list:
            smtm = delete(names).where(names.c.name == name)
            await session.execute(smtm)
            await session.commit()
        return {"status": "success"}
    except:
        return {"status": "error"}
