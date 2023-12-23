import { useContext, useEffect, useState } from "react";
import "./Login.css";
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom";

export const Registration = () => {
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [password, setPassword] = useState('')
   const [emailDirty, setemailDirty] = useState(false)
   const [passwordDirty, setpasswordDirty] = useState(false)
   const [emailError, setemailError] = useState('Email не может быть апустым')
   const [passwordError, setpasswordError] = useState('Пароль не может быть пустым')
   const [formValid, setFormValid] = useState(false)
   const navigate = useNavigate()
   const [, setToken] = useContext(UserContext)


   useEffect(() => {
      if (emailError || passwordError) {
         setFormValid(false)
      } else {
         setFormValid(true)
      }
   }, [emailError, passwordError])

   const blurHandler = (e) => {
      switch (e.target.name) {
         case 'email':
            setemailDirty(true)
            break
         case 'password':
            setpasswordDirty(true)
            break
      }
   }

   const emailHandler = (e) => {
      setEmail(e.target.value)
      const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!re.test(String(e.target.value).toLowerCase())) {
         setemailError('Некорректный email')
      } else {
         setemailError("")
      }
   }

   const passwordHandler = (e) => {
      setPassword(e.target.value)
      if (e.target.value.length < 3) {
         setpasswordError('Пароль должен быть длиннее 3 символов')
         if (!e.target.value) {
            setpasswordError('Пароль не может быть пустым')
         }
      }
      else {
         setpasswordError('')
      }
   }


   const handleSubmit = (e) => {
      e.preventDefault();
      submitRegistration();
   }

   const submitRegistration = async () => {
      const requestOptions = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email: email, name: name, hashed_password: password }),
      };
      const response = await fetch("/api/users", requestOptions);
      const data = await response.json()

      if (response.ok) {
         navigate("/");
      } else if (response.status == 400) {
         alert("Аккаунт с таким email уже существует")
      }
   };

   return (
      <h1>
         <form class="loginForm" onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            <div>
               <input
                  onChange={e => emailHandler(e)}
                  value={email}
                  onBlur={e => blurHandler(e)}
                  name="email"
                  class="loginFormField"
                  type="text"
                  placeholder="Email"
                  required
               />
            </div>
            <div>
               <input
                  onChange={e => setName(e.target.value)}
                  value={name}
                  name="name"
                  class="loginFormField"
                  type="text"
                  placeholder="Имя"
                  required
               />
            </div>
            <div>
               <input
                  onChange={e => passwordHandler(e)}
                  value={password}
                  onBlur={e => blurHandler(e)}
                  name="password"
                  class="loginFormField"
                  type="password"
                  placeholder="Пароль"
                  required
               />
            </div>
            <div>
               <button disabled={!formValid} class="blackBtn" type="submit" >
                  Зарегистрироваться
               </button>
            </div>
         </form>
         <div>
            {(passwordDirty && passwordError) && <div id="errorPassw" style={{ color: 'red' }}>{passwordError}</div>}
            {(emailDirty && emailError) && <div id="errorLogin" style={{ color: 'red' }}>{emailError}</div>}
         </div>
      </h1>
   );
}