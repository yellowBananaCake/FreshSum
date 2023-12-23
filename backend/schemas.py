import datetime as _dt
from typing import List, Tuple

import pydantic as _pydantic


class _UserBase(_pydantic.BaseModel):
    email: str
    name: str

    class Config:
        orm_mode = True


class Role(_pydantic.BaseModel):
    id: int = 1
    name: str = 'user'

    class Config:
        orm_mode = True

class Product(_pydantic.BaseModel):
    name: str
    proteins: float
    fats: float
    carbs: float
    calories: float

    class Config:
        orm_mode = True

class Dish(_pydantic.BaseModel):
    dish_date: str
    dish_name: str
    dish_amount: int

    class Config:
        orm_mode = True

class DictDish(_pydantic.BaseModel):
    name: str
    product: str

    class Config:
        orm_mode = True

class Report(_pydantic.BaseModel):
    start_date: str
    end_date: str

    class Config:
        orm_mode = True

class ReportField(_pydantic.BaseModel):
    id: int
    name: str
    date: _dt.datetime

    class Config:
        orm_mode = True


class UserCreate(_UserBase):
    hashed_password: str


class User(_UserBase):
    id: int
    role_id: int
