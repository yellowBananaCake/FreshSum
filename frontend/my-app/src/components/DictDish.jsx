import "./Dish.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import parse from 'html-react-parser';


export const DictDish = () => {
    const [token] = useContext(UserContext)
    const navigate = useNavigate()
    const [prods, setProds] = useState([]);

    const [dishNameCurrent, setProdNameCurrent] = useState("")
    const [dishAmount, setDishAmount] = useState(1)
    const [dishListPopupItems, setDishListPopupItems] = useState("")
    const [prodName, setProdName] = useState("")
    const [dishName, setDishName] = useState("")
    const [prodNum, setProdNum] = useState(0)

    useEffect(() => {
        queryDictDishes()
    });


    const queryDictDishes = async () => {
        const queryDictDishesOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };
        const queryDictDishesResponse = await fetch("/api/product", queryDictDishesOptions);
        const queryDictData = await queryDictDishesResponse.json()

        let select = "";
        for (var i = 0; i < queryDictData.length; ++i) {
            let option = queryDictData[i];
            let element = document.createElement('option');
            element.textContent = option;
            element.value = option;
            select += element.outerHTML;
        }
        let element = document.createElement('option');
        element.textContent = "Выберите продукт";
        element.value = "Выберите продукт";
        select = element.outerHTML + select;

        setDishListPopupItems(select)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitDish();
    }

    const submitDish = async () => {
        if(prods.length == 0 || dishName == ""){
            alert("Не все поля заполнены")
        }
        let str = "";
        for (let i = 0; i < prods.length; i++) {
            str += JSON.stringify(prods[i]);
            str += "|";
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ name: dishName, product: str })
        };
        const response = await fetch("/api/dict_dish", requestOptions);
        if (response.ok) {
            alert("Блюдо добавлено")
        } else {
            alert("Произошла ошибка")
        }
    };


    const handlerDishNameCurrent = (e) => {
        setProdNameCurrent(e.target.value)
    }

    const handlerProdName = (e) => {
        setProdName(e.target.value.toString())
        console.log(prodName)
    }

    return (
        <div>
            <div class="dictForm">
                <form class="loginForm" onSubmit={handleSubmit}>
                    <h2>Ввод блюд</h2>
                    <div class="block">
                        <input
                            onChange={e => setDishName(e.target.value)}
                            value={dishName}
                            name="dishName"
                            className="dishNameField"
                            type="text"
                            placeholder="Название"
                            required
                        />
                    </div>
                    <div class="block">
                        <label for="listDishNamesId">Продукт&nbsp;</label><select
                            name="prodNum"
                            id="listDishNamesId"
                            onChange={e => handlerProdName(e)}
                            defaultValue={prodName}
                        >
                            {parse(dishListPopupItems)}
                        </select>
                    </div>
                    <div class="block">
                        <label for="dishAmountId">Вес&nbsp;</label><input
                            onChange={e => setProdNum(e.target.value)}
                            value={prodNum}
                            onBlur={e => { }}
                            name="dishAmount"
                            class="dishFormInput"
                            type="number"
                            step="any"
                            required
                            id="dishAmountId"
                        />
                    </div>
                    <div className="block">
                        <button className="blackBtn" type="submit" onClick={e => handleSubmit(e)}>
                            Сохранить
                        </button>
                    </div>
                </form>

                <button class="blackBtn; b1" onClick={() => {
                    if(prodName == "" || prodNum == 0) alert("Не все поля заполнены")
                    else setProds(prods.concat([{ name: prodName, prodNum: prodNum }]));
                }}>
                    Добавить
                </button>

            </div>
            {prods.length != 0 &&
                <table class="table table-hover">
                    <thead >
                        <tr>
                            <td>Продукт</td>
                            <td>Вес</td>
                        </tr>
                    </thead>

                    <tbody>
                        {prods.map(({ name, prodNum }) => (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>{prodNum}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    );
};

export default DictDish;