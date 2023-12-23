import database as _database
import datetime as _dt
import sqlalchemy.orm as _orm
import models as _models, schemas as _schemas
import passlib.hash as _hash
import jwt as _jwt
import fastapi as _fastapi
import fastapi.security as _security
from sqlalchemy.sql.functions import random as _random
from typing import List

import sqlite3

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "secret"

# def create_database():
#     sqlite3.connect('database.db')
    


# ---------------------------MISC-----------------------------------
# def require_admin(func):
#     async def wrapped(current_user: _schemas.User, *args, **kwargs):
#         if not is_admin(current_user):
#             raise _fastapi.HTTPException(status_code=401, detail='Must be an admin to perform this action')

#         return await func(*args, **kwargs)

#     return wrapped



# -----------------------DATABASE-FUNCTIONS-------------------------
def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------USER-AND-LOGIN-FUNCTIONS-------------------------------
async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def _user_selector(user_id: int, db: _orm.Session):
    user = db.query(_models.User).filter_by(id=user_id).first()

    if user is None:
        raise _fastapi.HTTPException(status_code=404, detail="User does not exist")

    return user


async def _user_selector_change(user_id, db: _orm.Session, current_user: _schemas.User):
    user = await _user_selector(user_id, db)

    if user.id != current_user.id:
        raise _fastapi.HTTPException(status_code=401, detail="Can't do that action to another user")

    return user


def is_admin(user: _schemas.User, db: _orm.Session = next(get_db())):
    user_db = db.query(_models.User).filter_by(email=user.email).first()
    return user_db.role.name == 'administrator'


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(email=user.email, name=user.name, hashed_password=_hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    return user_obj


async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(email, db)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: _models.User):

    data = {'name': user.name, 'email': user.email, 'password': user.hashed_password}

    token = _jwt.encode(data, JWT_SECRET)
    return dict(access_token=token, token_type="bearer")


async def get_current_user(db: _orm.Session = _fastapi.Depends(get_db), token: str = _fastapi.Depends(oauth2schema)):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).filter_by(email=payload["email"]).first()
    except:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return _schemas.User.from_orm(user)

async def is_admin():
    return get_current_user().role_id == 2

async def get_users(db: _orm.Session):
    users = db.query(_models.User).all()

    return list(map(_schemas.User.from_orm, users))


async def get_user(user_id: int, db: _orm.Session):
    user = await _user_selector(user_id, db)

    return _schemas.User.from_orm(user)


async def delete_user(user_id: int, current_user: _schemas.User, db: _orm.Session):
    user = await _user_selector_change(user_id, db, current_user)

    db.delete(user)
    db.commit()


async def update_user(user_id: int, user: _schemas.UserCreate, current_user: _schemas.User, db: _orm.Session):
    old_user = await _user_selector_change(user_id, db, current_user)

    old_user.name = user.name
    old_user.email = user.email
    old_user.hashed_password = _hash.bcrypt.hash(user.hashed_password)

    db.commit()
    db.refresh(old_user)

    return _schemas.User.from_orm(old_user)
