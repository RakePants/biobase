from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.orm import load_only
from starlette.responses import JSONResponse

from backend.src.database import get_async_session
from backend.src.operations.models import names
from backend.src.operations.schemas import OperationCreate

from pyaspeller import YandexSpeller

speller = YandexSpeller()

router = APIRouter(
    prefix="/operations",
    tags=["Operation"]
)


@router.post("/search")
async def search_name(name: str, session: AsyncSession = Depends(get_async_session)):
    fixed_name = speller.spelled(name)
    query = select(names.c.name).where(func.lower(names.c.name).like(func.lower(f"%{fixed_name}%")))
    print(query)
    result = await session.execute(query)
    names_from_result = [tuple(el) for el in result.all()]
    return JSONResponse({"text": names_from_result})

# @app.post("/search")
# async def search(data = Body()):
#
#     request = data['request']
#     fixed = speller.spelled(request)
#     cursor.execute(f"select name from names where lower(name) like lower('%{fixed}%')")
#     all_names = cursor.fetchall()
#     return JSONResponse({"text": all_names})

# @router.post("/")
# async def add_specific_operations(new_operation: OperationCreate, session: AsyncSession = Depends(get_async_session)):
#     stmt = insert(operation).values(**new_operation.dict())
#     await session.execute(stmt)
#     await session.commit()
#     return {"status": "success"}
