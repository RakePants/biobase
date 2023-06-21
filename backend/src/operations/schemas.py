from datetime import datetime

from pydantic import BaseModel


class ChangeNames(BaseModel):
    name: str
    new_name: str


class SearchName(BaseModel):
    name: str


class AddName(BaseModel):
    name: str


class DeleteName(BaseModel):
    name: list