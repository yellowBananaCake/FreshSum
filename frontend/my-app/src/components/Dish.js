import "./Dish.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import parse from 'html-react-parser';


export const Dish = () => {
    const [token] = useContext(UserContext)
    const navigate = useNavigate()

    const [dishDate, setDishDate] = useState(new Date().toISOString().split('T')[0])
    const [dishNameCurrent, setDishNameCurrent] = useState("")
    const [dishAmount, setDishAmount] = useState(1)
    const [dishListPopupItems, setDishListPopupItems] = useState("")
    const [dishName, setDishName] = useState("")

    let dishValueName = "dish", dishValueIndex = 0
    let dishValue = dishValueName + (dishValueIndex++).toString(), dishCaption = "&lt;&lt;Выберите блюдо&gt;&gt;"
    let dishList = { len: 1, dishes: {} }, dishListPopup = ""; dishList.dishes[dishValue] = dishCaption; dishListPopup = dishListPopup.concat("<option value=\"" + dishValue + "\">" + (dishList.dishes[dishValue] = dishCaption) + "</option>")


    useEffect(() => {
        queryDictDishes()
        setDishName(dishList["dish0"])
    }, [dishListPopupItems]);


    const queryDictDishes = async () => {
        const queryDictDishesOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };
        const queryDictDishesResponse = await fetch("/api/dict_dish", queryDictDishesOptions);
        const queryDictData = await queryDictDishesResponse.json()

        if ((queryDictData || []).length && (queryDictData.length >= dishList.len)) {
            for (let queryDictDataIndex = 0; queryDictDataIndex < queryDictData.length; queryDictDataIndex++) {
                dishValue = dishValueName + (queryDictDataIndex + 1).toString();
                dishCaption = queryDictData[queryDictDataIndex]["name"];
                dishList.len++;
                dishListPopup = dishListPopup.concat("\n<option value=\"" + dishValue + "\">" + (dishList.dishes[dishValue] = dishCaption) + "</option>");
            }
        }
        setDishListPopupItems(dishListPopup)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitDish();
    }

    const submitDish = async () => {
        if ((dishNameCurrent || "dish0") == "dish0") {
            alert("Выберите блюдо")
            return
        }
        if (dishAmount < 0) {
            alert("Количество должно быть неотрицательным (при вводе нуля блюдо удаляется)")
            return
        }

        const queryDictDishesOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };
        const queryDictDishesResponse = await fetch("/api/dict_dish", queryDictDishesOptions);
        const queryDictData = await queryDictDishesResponse.json()

        const body_str = {
            dish_date: dishDate,
            dish_name: queryDictData[Number(dishNameCurrent.replace("dish", "")) - 1]["name"],
            dish_amount: dishAmount
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body_str)
        };
        const response = await fetch("/api/dish", requestOptions);
        const data = await response.json()

        if (response.ok) {
            if (dishAmount == 0) {
                alert("Данные удалены")
            } else {
                alert("Данные добавлены или обновлены")
            }
        } else {
            alert("Проверьте правильность данных")
        }
    };


    const handlerDishNameCurrent = (e) => {
        setDishNameCurrent(e.target.value)
    }

    const handlerDishAmount = (e) => {
        setDishAmount(e.target.value)
    }

    return (
        <div>
            <form class="dishForm" onSubmit={handleSubmit}>
                <h2>Ввод блюд</h2>
                <div class="block">
                    <label for="dishDateId">Дата&nbsp;</label><input
                        onChange={e => setDishDate(e.target.value)}
                        defaultValue={dishDate}
                        onBlur={e => { }}
                        name="dishDate"
                        className="dishFormInput"
                        type="date"
                        required
                        id="dishDateId"
                    />
                </div>
                <div class="block">
                    <label for="listDishNamesId">Блюдо&nbsp;</label><select
                        name="dishNames"
                        id="listDishNamesId"
                        onChange={e => handlerDishNameCurrent(e)}
                        defaultValue={dishNameCurrent}
                    >
                        {parse(dishListPopupItems)}
                    </select>
                </div>
                <div class="block">
                    <label for="dishAmountId">Количество&nbsp;</label><input
                        onChange={e => handlerDishAmount(e)}
                        defaultValue={dishAmount}
                        onBlur={e => { }}
                        name="dishAmount"
                        className="dishFormInput"
                        type="number"
                        required
                        id="dishAmountId"
                    />
                </div>
                <div className="block">
                    <button className="blackBtn btn btn-outline-primary btn-sm" type="submit">
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Dish;