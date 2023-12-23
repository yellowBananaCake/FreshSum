from typing import List, Tuple
from fastapi import FastAPI
import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy as _sql
from sqlalchemy import select

import sqlalchemy.orm as _orm

import services as _services, schemas as _schemas

from fastapi.responses import FileResponse

# TODO сервисы
import models as _models
from datetime import datetime
import json


# DEBUG дебаг библиотеки
import logging
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

tags_metadata = [
    {
        "name": "Users",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "Subjects",
        "description": "Operations with Subjects",
    },
    {
        "name": "Teachers",
        "description": "Operations with Teachers",
    },
    {
        "name": "Themes",
        "description": "Operations with Themes",
    },
    {
        "name": "Questions",
        "description": "Operations with Questions",
    },
    {
        "name": "Answers",
        "description": "Operations with Answers",
    },
    {
        "name": "Tests",
        "description": "Operations with Tests",
    },
    {
        "name": "Dishes",
        "description": "Operations with Dishes",
    },
    {
        "name": "Reports",
        "description": "Operations with Reports",
    },
    {
        "name": "DictDishes",
        "description": "Operations with DictDishes",
    },
    {
        "name": "Products",
        "description": "Operations with Products",
    },
]

import uvicorn


if __name__ == "__main__":
    uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)

app = _fastapi.FastAPI(openapi_tags=tags_metadata)

@app.get("/")
def main():
    return FileResponse("public/index.html")


@app.post("/api/users", tags=["Users"])
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already is use")
    user = await _services.create_user(user, db)
    token = await _services.create_token(user)
    token['user_id'] = user.id
    
    return token

@app.post("/api/dish", tags=["Dishes"])
async def create_dish(
    dish: _schemas.Dish,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
    ):

    #TODO сервисы
    temp_dish_date = datetime(int(dish.dish_date.split('-')[0]), int(dish.dish_date.split('-')[1]),
                    int(dish.dish_date.split('-')[2]), 0, 0, 0, 0)
    
    if (dish.dish_amount < 0): raise _fastapi.HTTPException(status_code=407, detail="Значение не может быть меньше 0")

    if (dish.dish_amount == 0):
        temp_dish = db.query(_models.Dish).filter_by(name=dish.dish_name, date=temp_dish_date).first()
        if temp_dish: 
            db.delete(temp_dish)
            db.commit()
        return

    temp_dish = db.query(_models.Dish).filter_by(name=dish.dish_name, date=temp_dish_date, user_id=user.id).first()
    
    if (temp_dish):
        temp_dish.amount = dish.dish_amount
    else:
        temp_dish = _models.Dish(name=dish.dish_name, amount=dish.dish_amount, user_id=user.id, date=temp_dish_date)
        db.add(temp_dish)
    db.commit()
    
    return "Ok"

@app.post("/api/product", tags=["Products"])
async def create_product(
    product: _schemas.Product,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
    ):

    if _services.is_admin == False: raise _fastapi.HTTPException(status_code=401, detail="Not Allowed")
    
    temp_product = _models.Product(name=product.name, proteins=product.proteins, fats=product.fats, carbs=product.carbs, calories=product.calories)
    db.add(temp_product)
    db.commit()
    
    return "Ok"

@app.get("/api/product", tags=["Products"])
async def create_dict_dishes(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    product_json = []
    
    product_list = db.query(_models.Product).all()
    for el in product_list: 
        product_json.append(el.name)
    return product_json

@app.post("/api/report", tags=["Reports"])
async def create_report(
    report: _schemas.Report,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
    ):

    #TODO сервисы
    temp_start_date = datetime(int(report.start_date.split('-')[0]), int(report.start_date.split('-')[1]),
                    int(report.start_date.split('-')[2]), 0, 0, 0, 0)
    temp_end_date = datetime(int(report.end_date.split('-')[0]), int(report.end_date.split('-')[1]),
                    int(report.end_date.split('-')[2]), 0, 0, 0, 0)
    
    sel = select(_models.DictDish.product, _models.Dish.date, _models.Dish.name, _models.Dish.amount).where(_sql.and_(_models.Dish.name == _models.DictDish.name, _models.Dish.date>=temp_start_date, 
                                                          _models.Dish.date<=temp_end_date, _models.Dish.user_id==user.id))
    row_prods = db.execute(sel.order_by(_models.Dish.date.desc()))
    
    responce_json = {}
    it = -1
    for row in row_prods:
        it += 1
        products = row._asdict()["product"].split("|")[:-1]
        dish_date = row._asdict()["date"]
        dish_name = row._asdict()["name"]
        dish_amount = int(row._asdict()["amount"])
        prods_amount = 0
        proteins = 0
        fats = 0
        carbs = 0
        calories = 0
        for i in products:
            amount = int(json.loads(i)["prodNum"])
            name   = json.loads(i)["name"]
            
            prod_info = db.execute(select(_models.Product.proteins, _models.Product.fats, _models.Product.carbs, _models.Product.calories).where(name==_models.Product.name)).first()._asdict()
            proteins += prod_info['proteins']
            fats += prod_info['fats']
            carbs += prod_info['carbs']
            calories += prod_info['calories']
            prods_amount += amount
        
        prods_amount = float(dish_amount/prods_amount)
        result_json = {'name': dish_name, 'date': dish_date, 'amount': dish_amount, 'proteins': round(proteins*prods_amount, 2), 'fats': round(fats*prods_amount, 2),
                           'carbs': round(carbs*prods_amount, 2), 'calories': round(calories*prods_amount, 2)}
        responce_json[it] = result_json
        
    print(responce_json)    

    return responce_json

@app.post("/api/dict_dish", tags=["DictDishes"])
async def create_dict_dishes(dish: _schemas.DictDish,
    user: _schemas.User = _fastapi.Depends(_services.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db)):
    
    temp = _models.DictDish(name=dish.name, product=dish.product)
    db.add(temp)
    db.commit()
    return "Ok"

@app.get("/api/dict_dish", tags=["DictDishes"])
async def create_dict_dishes(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    dict_dishes_json = []
    
    dict_dishes_list = db.query(_models.DictDish).all()
    for el in dict_dishes_list: 
        dict_dishes_json.append({"name": el.name, "product": el.product})
    return dict_dishes_json

# DEBUG отладочное изображение ошибки 422
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
	exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
	logging.error(f"{request}: {exc_str}")
	content = {'status_code': 10422, 'message': exc_str, 'data': None}
	return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


@app.get("/api/users", tags=["Users"], response_model=List[_schemas.User])
async def get_users(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_users(db)


@app.get("/api/users/me", tags=["Users"], response_model=_schemas.User)
async def get_current_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user


@app.get("/api/users/{user_id}", tags=["Users"], status_code=200)
async def get_user(user_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_user(user_id, db)


@app.delete("/api/users/{user_id}", tags=["Users"], status_code=204)
async def delete_user(
        user_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        current_user: _schemas.User = _fastapi.Depends(_services.get_current_user)
):
    await _services.delete_user(user_id, current_user, db)

    return {"message": "Deleted Successfully"}


@app.put('/api/users/{user_id}', tags=["Users"], status_code=200)
async def update_user(
        user_id: int,
        user: _schemas.UserCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        current_user: _schemas.User = _fastapi.Depends(_services.get_current_user)
):
    await _services.update_user(user_id, user, current_user, db)
    return {"message": "Updated Successfully"}


# ------------------------LOGIN-API------------------------------
@app.post("/api/token", tags=["Users"])
async def generate_token(
        form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
        db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)
    
    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)