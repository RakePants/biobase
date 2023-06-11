from fastapi import APIRouter, Depends
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.database import get_async_session
from backend.src.operations.models import names
from backend.src.operations.schemas import OperationCreate

from pyaspeller import YandexSpeller

speller = YandexSpeller()

router = APIRouter(
    prefix="/operations",
    tags=["Operation"]
)


@router.post("/")
async def get_specific_operations(name: str, session: AsyncSession = Depends(get_async_session)):
    fixed_name = speller.spelled(name)
    query = select(names).where(names.c.name.like(f"%{fixed_name}%"))
    result = await session.execute(query)
    print(result.all())
    return name


# @router.post("/")
# async def add_specific_operations(new_operation: OperationCreate, session: AsyncSession = Depends(get_async_session)):
#     stmt = insert(operation).values(**new_operation.dict())
#     await session.execute(stmt)
#     await session.commit()
#     return {"status": "success"}
