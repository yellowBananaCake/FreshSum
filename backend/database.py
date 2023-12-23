# import sqlalchemy as _sql
from sqlalchemy import create_engine
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm

from sqlalchemy.orm import DeclarativeBase


DATABASE_NAME = "test.db"
DATABASE_URL = "sqlite:///./" + DATABASE_NAME

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = _orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)
class Base(DeclarativeBase): pass

