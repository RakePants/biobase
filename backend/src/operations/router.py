import sys
from os.path import dirname as up

project_dir = up(up(up(up(__file__))))
sys.path.append(project_dir)

from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, insert, update, delete, text, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.orm import load_only
from starlette.responses import JSONResponse

from backend.src.database import get_async_session
from backend.src.operations.models import names
from backend.src.operations.schemas import ChangeNames, SearchName, DeleteName, AddName

from pyaspeller import YandexSpeller

from deep_translator import GoogleTranslator

# import pymorphy3
#
# morph = pymorphy3.MorphAnalyzer()

speller = YandexSpeller()


router = APIRouter(
    prefix="",
    tags=["Operation"]
)


@router.post("/number_of_entries")
async def number_of_entries(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(func.count()).select_from(names))

    return JSONResponse({"number_of_entries": result.all()[0][0]})


@router.post("/correct")
async def correct_name(request: SearchName):
    try:
        fixed_name = speller.spelled(request.name)
    except:
        print("Speller didn't work")
        fixed_name = request.name
    return {"you_mean": fixed_name}


@router.post("/search")
async def search_name(request: SearchName, session: AsyncSession = Depends(get_async_session)):
    name = request.name
    transleted_name_eu = GoogleTranslator(source='auto', target='eu').translate(text=name)
    transleted_name_ru = GoogleTranslator(source='auto', target='ru').translate(text=name)

    await session.execute(text('CREATE EXTENSION IF NOT EXISTS pg_trgm'))
    await session.execute(text('SELECT set_limit(0.1)'))

    if name == transleted_name_eu:
        query = select(names.c.name).where(or_(func.lower(names.c.name).bool_op('%')(func.lower(name)), func.lower(names.c.name).bool_op('%')(func.lower(transleted_name_ru)))).order_by(
        func.similarity(names.c.name, name).desc())
    else:
        query = select(names.c.name).where(or_(func.lower(names.c.name).bool_op('%')(func.lower(name)), func.lower(names.c.name).bool_op('%')(func.lower(transleted_name_eu)))).order_by(
        func.similarity(names.c.name, name).desc())

    result = await session.execute(query)
    names_from_result = [tuple(el) for el in result.all()]
    return JSONResponse({"text": names_from_result, "you_mean": name})


@router.post("/update")
async def update_name(data: ChangeNames, session: AsyncSession = Depends(get_async_session)):
    try:
        old_name = data.name
        new_name = data.new_name
        smtm = update(names).where(names.c.name == old_name).values(name=new_name)
        await session.execute(smtm)
        await session.commit()
    except:
        raise HTTPException(status_code=400, detail="Duplicate name or value not found")


@router.post("/add")
async def add_name(request: AddName, session: AsyncSession = Depends(get_async_session)):
    try:
        smtm = insert(names).values(name=request.name)
        await session.execute(smtm)
        await session.commit()
    except:
        raise HTTPException(status_code=400, detail="Duplicate name")


@router.post("/delete")
async def delete_name(request: DeleteName, session: AsyncSession = Depends(get_async_session)):
    try:
        names_list = request.name
        for name in names_list:
            smtm = delete(names).where(names.c.name == name)
            await session.execute(smtm)
            await session.commit()
    except:
        raise HTTPException(status_code=400, detail="Something went wrong")
