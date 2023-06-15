from datetime import datetime

from pydantic import BaseModel


class ChangeNames(BaseModel):
    name: str
    new_name: str
