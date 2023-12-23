from services import get_db
# from services import get_db, generate_test, create_answer
import models as _models
import passlib.hash as _hash
from faker import Faker
import random
from sqlalchemy.sql.functions import random as _random
import os
import schemas as _schemas
import asyncio
import sqlalchemy.orm as _orm

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from database import engine

db = next(get_db())

USER_AMOUNT = 25


def fill_roles():
    if db.query(_models.Role).first():
        print('Роли созданы')
        return
    
    print('-----------------------------------------------')
    print('Создаём роли')
    
    db.add(_models.Role(id=1, name="user"))
    db.add(_models.Role(id=2, name="administrator"))
    db.commit()

    


def fill_users():
    print('-----------------------------------------------')
    print('Создаём пользователей')

    fake = Faker(locale="ru_RU")
    Faker.seed(0)


    admin_model = _models.User(email="admin@mail.ru", name="admin",
                               hashed_password=_hash.bcrypt.hash("admin"), role_id=2)
    db.add(admin_model)
    db.commit()

    for i in range(USER_AMOUNT):
        name = fake.name()
        email = fake.email()
        password = 'password'

        user = _models.User(email=email, name=name, hashed_password=_hash.bcrypt.hash(password), role_id=1)

        db.add(user)
        db.commit()

    print('Пользователи созданы')


fillers = [fill_roles, fill_users]


def setup():
    1+1
    


async def fill():
    setup()

    for filler in fillers:
        filler()

if __name__ == '__main__':
    asyncio.run(fill())
