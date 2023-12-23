import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext()
export const AdminContext = createContext()


export const UserProviser = (props) => {
    const [token, setToken] = useState(localStorage.getItem("tokenStorage"));
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const tokenToCheck = (token || "").replace(/^\{\d+\}/, "");
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokenToCheck,
                },
            };
            const response = await fetch("/api/users/me", requestOptions);

            if (!response.ok) {
                setToken(null);
            }
            localStorage.setItem("tokenStorage", token)
            const data = await response.json();
            setIsAdmin(data.role_id == 2);
        };
        fetchUser();
    }, [token, isAdmin]);

    return (
        <UserContext.Provider value={[token, setToken]}>
            <AdminContext.Provider value={[isAdmin, setIsAdmin]}>
                {props.children}
            </AdminContext.Provider>
        </UserContext.Provider>
    )
}