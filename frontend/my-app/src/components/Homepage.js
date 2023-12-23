// import "./Homepage.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export const Homepage = () => {
    const [currentUserEMail, setCurrentUserEMail] = useState("")
    const [token] = useContext(UserContext)

    useEffect(() => {
        queryCurrentUser()
    }, []);


    const queryCurrentUser = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };
        const response = await fetch("/api/users/me", requestOptions);
        if (response.ok) {
            const data = await response.json()
            setCurrentUserEMail("Выполнен вход с логином ".concat(data.email))
        } else {
            setCurrentUserEMail("Вход не выполнен")
        }
    };



    return (
        <div>{token ? currentUserEMail : "Вход не выполнен. Для начала работы нажми кнопку \"Войти\" или \"Зарегистрироваться\", если у тебя ещё нет аккаунта."}</div>
    );
}