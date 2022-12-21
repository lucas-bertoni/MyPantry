// All written by Lucas Bertoni
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const Login = () => {
    useEffect(() => {
        const checkLoggedIn = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === 'production'
                ? 'http://localhost:4001/auth' // Change if actually deployed to real web server
                : 'http://localhost:4001/auth';
            yield axios.post(url, {}, { withCredentials: true })
                .then((axiosResponse) => {
                if (axiosResponse.status === 200) {
                    alert('You are already signed in');
                    window.location.href = '/#/home';
                }
            })
                .catch((axiosError) => {
                return;
            });
        });
        checkLoggedIn();
    }, []);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const onSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        if (email === '' || email === null) {
            alert('Please enter your email');
        }
        else if (password === '' || password === null) {
            alert('Please enter your password');
        }
        else {
            const data = { email, password };
            yield axios.post('http://localhost:4001/login', data, { withCredentials: true })
                .then((axiosResponse) => {
                if (axiosResponse.status === 200) {
                    window.location.href = '/#/home';
                }
            })
                .catch((axiosError) => {
                var _a, _b, _c;
                if (((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
                    alert('User with that email doesn\'t exist');
                    window.location.reload();
                }
                else if (((_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
                    alert('Incorrect or invalid login information');
                    window.location.reload();
                }
                else if (((_c = axiosError.response) === null || _c === void 0 ? void 0 : _c.status) === 500) {
                    alert('Something went wrong on our end');
                    window.location.reload();
                }
            });
            setEmail('');
            setPassword('');
        }
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: "container mt-5" },
            React.createElement("div", { className: "d-flex justify-content-center" },
                React.createElement("h1", null, "My Pantry"))),
        React.createElement("div", { className: "container my-5 w-25" },
            React.createElement("ul", { className: "nav nav-pills nav-justified mb-3", id: "ex1", role: "tablist" },
                React.createElement("li", { className: "nav-item", role: "presentation" },
                    React.createElement("a", { className: "nav-link active", id: "tab-login", "data-mdb-toggle": "pill", href: "javascript:void(0)", role: "tab", "aria-controls": "pills-login", "aria-selected": "true" }, "Login")),
                React.createElement("li", { className: "nav-item", role: "presentation" },
                    React.createElement("a", { className: "nav-link", id: "tab-register", "data-mdb-toggle": "pill", href: "/#/register", role: "tab", "aria-controls": "pills-register", "aria-selected": "false" }, "Register"))),
            React.createElement("div", { className: "tab-content mt-5" },
                React.createElement("div", { className: "tab-pane fade show active", id: "pills-login", role: "tabpanel", "aria-labelledby": "tab-login" },
                    React.createElement("form", { onSubmit: onSubmit },
                        React.createElement("div", { className: "form-outline mb-4" },
                            React.createElement("input", { type: "email", id: "current-email", className: "form-control", autoComplete: "current-email", onChange: (e) => { setEmail(e.target.value); } }),
                            React.createElement("label", { className: "form-label", htmlFor: "loginName" }, "Email")),
                        React.createElement("div", { className: "form-outline mb-4" },
                            React.createElement("input", { type: "password", id: "current-password", className: "form-control", autoComplete: "current-password", onChange: (e) => { setPassword(e.target.value); } }),
                            React.createElement("label", { className: "form-label", htmlFor: "loginPassword" }, "Password")),
                        React.createElement("div", { className: "row mb-4" },
                            React.createElement("div", { className: "d-flex justify-content-center" },
                                React.createElement("a", { href: "#" }, "Forgot password?"))),
                        React.createElement("button", { className: "btn btn-primary btn-block mb-4 w-100" }, "Sign in"),
                        React.createElement("div", { className: "text-center" },
                            React.createElement("p", null,
                                "Not a member? ",
                                React.createElement("a", { href: "/#/register" }, "Register")))))))));
};
export default Login;
