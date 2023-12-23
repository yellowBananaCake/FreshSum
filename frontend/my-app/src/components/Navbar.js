import { useNavigate, Link } from "react-router-dom"
import { AdminContext, UserContext } from "../context/UserContext"
import { useContext, useEffect, useState } from "react";
import "./Navbar.css"

export const Navbar = () => {
  const [token, setToken] = useContext(UserContext)
  const [isAdmin, ] = useContext(AdminContext)
  
  const navigate = useNavigate()

  return (
    <div class="App">
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
        </a>
        <div class="px-2; col-md-0; outer;">
          {token == null && (
            <div class="inner">
              <button type="button" class="px-2 btn btn-outline-primary me-2" onClick={() => navigate('/login')}>Войти</button>
              <button type="button" class="px-2 btn btn-primary me-2" onClick={() => navigate('/registration')}>Зарегистрироваться</button>
            </div>
          )}
          {token != null && !isAdmin && (
            <div class="inner">
              <button type="button" class="px-2 btn btn-primary me-2" onClick={() => navigate('/dish')}>Внести блюдо</button>
              <button type="button" class="px-2 btn btn-primary me-2" onClick={() => navigate('/report')}>Отчёт</button>
              <button type="button" class="px-2 btn btn-primary me-2" onClick={() => { setToken(null); navigate('/') }}>Выход</button>
            </div>
          )}
          {token != null && isAdmin && (
            <div class="inner">
              <button type="button" class="px-2 btn btn-primary me-2" onClick={() => navigate('/product')}>Внести продукт</button>
              <button type="button" class="px-2 btn btn-primary me-2" onClick={() => navigate('/dict_dish')}>Внести блюдо</button>
              <button type="button" class="px-2 btn btn-primary me-2" onClick={() => { setToken(null); navigate('/') }}>Выход</button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
