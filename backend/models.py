import datetime as _dt
from sqlalchemy import (
    Column, ForeignKey, Table,
    Integer, String, DateTime, Float, ARRAY
)
from database import DATABASE_URL
from sqlalchemy.orm import relationship
import passlib.hash as _hash

#-------------
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import create_engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
class Base(DeclarativeBase): pass
# ------------------

class Dish(Base):
    __tablename__ = "Dishes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Integer, ForeignKey("DictDishes.name"))
    amount = Column(String)
    user_id = Column(Integer, ForeignKey("Users.id"))
    date = Column(DateTime)
    

class DictDish(Base):
    __tablename__ = "DictDishes"
    name = Column(String, index=True, primary_key=True)
    product = Column(String) 


class Product(Base):
    __tablename__ = "Products"
    name = Column(String, primary_key=True, index=True)
    proteins = Column(Float)
    fats = Column(Float)
    carbs = Column(Float)
    calories = Column(Float)



class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, default="")
    hashed_password = Column(String)
    role_id = Column(Integer, ForeignKey("Roles.id"), default=1)


    class Config:
        from_attributes = True
    

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)

class Role(Base):
    __tablename__ = "Roles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, index=True, unique=True)





# ------------
Base.metadata.create_all(bind=engine)
# -----------