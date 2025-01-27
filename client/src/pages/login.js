import * as FaIcons from 'react-icons/fa';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { Tilt } from "react-tilt";
import swal from 'sweetalert';
import Swal from 'sweetalert2'
import logo from '../logo.jpeg'
import usePasswordToggle from "../hooks/usePasswordToggle"



async function loginUser(credentials) {
    return fetch('https://us-central1-gestiondaarait.cloudfunctions.net/app/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

function LoginPage() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async event => {
        event.preventDefault();
        const response = await loginUser({
            email,
            password
        });
        if ('token' in response) {
            swal("Success", response.message, "success", {
                buttons: false,
                timer: 2000,
            })
                .then((value) => {
                    localStorage.setItem('token', response['token']);
                    localStorage.setItem('user', JSON.stringify(response['fullname']));
                    localStorage.setItem('role', JSON.stringify(response['role']));
                    localStorage.removeItem("loginFailed");
                    window.location.href = "/read";
                });
        } else {
            localStorage.setItem('loginFailed', response['error']);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Utilisateur non trouvé!',
                footer: '<a href="/register">créer un compte?</a>'
              })
        }
    }
    const [PasswordInputType, ToggleIcon] = usePasswordToggle();

    return (
        <main>
            <div className="limiter" >
                <div className="container-login100" >
                    <div className="wrap-login100" >
                        <Tilt className="Tilt"
                            options={
                                { max: 50 }
                            } >
                            <div className="Tilt-inner login100-pic" data-tilt>
                            <img src={logo}
                                    alt="image" />
                            </div>
                        </Tilt>

                        <form onSubmit={handleSubmit} className="login100-form validate-form" >
                            <span className="login100-form-title" >
                               <h1> Se Connecter </h1>
                            </span>
                            <div className="wrap-input100 validate-input"
                                 validate="Valid login is required: exabc.123" >
                                <input className="input100"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email" 
                                    onChange={e => setEmail(e.target.value)}
                                    />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <FaIcons.FaUser />
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input"
                                 validate="Password is required" >
                                <input className="input100"
                                    type={PasswordInputType}
                                    name="password"
                                    placeholder="Password"
                                    id="password" 
                                    onChange={e => setPassword(e.target.value)}
                                    />
                                < span className="focus-input100">
                                </span>
                                <span className="symbol-input100">
                                    <FaIcons.FaLock />
                                </span >
                                <span className="symbol-input200">
                                    <i className="toggle-password" >
                                        {ToggleIcon}
                                    </i>
                                </span>
                            </div>

                            <div className="container-login100-form-btn" >
                                <button className="login100-form-btn"
                                    style={
                                        { background: '#ea4335' }
                                    }
                                    name="logInadmin"
                                    type="submit" >
                                    <i className="fa-signIn" >
                                        <FaIcons.FaSignInAlt />
                                    </i>
                                    Validation
                                </button>
                            </div>
                            <div className="text-center p-t-12">    
                                <a className="txt2"
                                    href="/register" >
                                    Créer un compte ?
                                </a>
                                
                            </div>
                             <p> Vous Acceptez Nos Conditions et Politiques de Securité </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LoginPage;
