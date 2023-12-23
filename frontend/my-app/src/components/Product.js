import "./Dish.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import parse from 'html-react-parser';


export const Product = () => {
    const [token] = useContext(UserContext)
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [proteins, setProteins] = useState(0.0)
    const [fats, setFats] = useState(0.0)
    const [carbs, setCarbs] = useState(0.0)
    const [calories, setCalories] = useState(0.0)



    const handleSubmit = (e) => {
        e.preventDefault();
        submitProduct();
    }

    const submitProduct = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ name: name, proteins: proteins, fats: fats, carbs: carbs, calories: calories }),
        };
        const response = await fetch("/api/product", requestOptions);

        if (!response.ok) {
            alert("Что-то пошло не так")
        } else {
            alert("Продукт добавлен")
            setName("")
            setProteins(0.0)
            setFats(0.0)
            setCarbs(0.0)
            setCalories(0.0)
        }
    };


    return (
        <div class="center">
            <form class="dishForm" onSubmit={handleSubmit}>
                <div class="block"><h2>Добавление продуктов</h2></div>
                <div class="block">
                    <label for="dishAmountId">Название&nbsp;</label><input
                        onChange={e => setName(e.target.value)}
                        defaultValue={name}
                        onBlur={e => { }}
                        name="dishAmount"
                        className="dishFormInput"
                        type="text"
                        required
                        id="dishAmountId"
                    />
                </div>
                <div class="block">
                    <label for="dishAmountId">Белки&nbsp;</label><input
                        onChange={e => setProteins(e.target.value)}
                        defaultValue={proteins}
                        onBlur={e => { }}
                        name="dishAmount"
                        className="dishFormInput"
                        type="number"
                        required
                        id="dishAmountId"
                        step="any"
                    />
                </div>
                <div class="block">
                    <label for="dishAmountId">Жиры&nbsp;</label><input
                        onChange={e => setFats(e.target.value)}
                        defaultValue={fats}
                        onBlur={e => { }}
                        name="dishAmount"
                        className="dishFormInput"
                        type="number"
                        required
                        id="dishAmountId"
                        step="any"
                    />
                </div>
                <div class="block">
                    <label for="dishAmountId">Углеводы&nbsp;</label><input
                        onChange={e => setCarbs(e.target.value)}
                        defaultValue={carbs}
                        onBlur={e => { }}
                        name="dishAmount"
                        className="dishFormInput"
                        type="number"
                        required
                        id="dishAmountId"
                        step="any"
                    />
                </div>
                <div class="block">
                    <label for="dishAmountId">Калории&nbsp;</label><input
                        onChange={e => setCalories(e.target.value)}
                        defaultValue={calories}
                        onBlur={e => { }}
                        name="dishAmount"
                        className="dishFormInput"
                        type="number"
                        required
                        id="dishAmountId"
                        step="any"
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

export default Product;