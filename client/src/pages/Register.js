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
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const onSubmit = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        if (email === '' || email === null) {
            alert('Please enter your email');
        }
        else if (password === '' || password === null /* || password.length < 8 */) {
            alert('Your password should be at least 8 characters');
        }
        else if (password !== repeatPassword) {
            alert('Your passwords don\'t match');
        }
        else {
            const data = { email, password };
            const url = process.env.NODE_ENV === 'production'
                ? 'http://localhost:4001/register' // Change if actually deployed to real web server
                : 'http://localhost:4001/register';
            yield axios.post(url, data, { withCredentials: true })
                .then((axiosResponse) => {
                if (axiosResponse.status === 201) {
                    window.location.href = '/#/home';
                }
            })
                .catch((axiosError) => {
                var _a, _b;
                if (((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                    alert('User with that email already exists');
                    window.location.reload();
                }
                else if (((_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.status) === 500) {
                    alert('Something went wrong on our end');
                    window.location.reload();
                }
            });
            setEmail('');
            setPassword('');
            setRepeatPassword('');
        }
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: "container mt-5" },
            React.createElement("div", { className: "d-flex justify-content-center" },
                React.createElement("h1", null, "My Pantry"))),
        React.createElement("div", { className: "container my-5 w-25" },
            React.createElement("ul", { className: "nav nav-pills nav-justified mb-3", id: "ex1", role: "tablist" },
                React.createElement("li", { className: "nav-item", role: "presentation" },
                    React.createElement("a", { className: "nav-link", id: "tab-login", "data-mdb-toggle": "pill", href: "/#/login", role: "tab", "aria-controls": "pills-login", "aria-selected": "true" }, "Login")),
                React.createElement("li", { className: "nav-item", role: "presentation" },
                    React.createElement("a", { className: "nav-link active", id: "tab-register", "data-mdb-toggle": "pill", href: "javascript:void(0)", role: "tab", "aria-controls": "pills-register", "aria-selected": "false" }, "Register"))),
            React.createElement("form", { className: "mt-5", onSubmit: onSubmit },
                React.createElement("div", { className: "form-outline mb-4" },
                    React.createElement("input", { type: "email", id: "register-email", className: "form-control", onChange: (e) => { setEmail(e.target.value); } }),
                    React.createElement("label", { className: "form-label", htmlFor: "register-email" }, "Email")),
                React.createElement("div", { className: "form-outline mb-4" },
                    React.createElement("input", { type: "password", id: "register-password", className: "form-control", onChange: (e) => { setPassword(e.target.value); } }),
                    React.createElement("label", { className: "form-label", htmlFor: "register-password" }, "Password")),
                React.createElement("div", { className: "form-outline mb-4" },
                    React.createElement("input", { type: "password", id: "register-repeat-password", className: "form-control", onChange: (e) => { setRepeatPassword(e.target.value); } }),
                    React.createElement("label", { className: "form-label", htmlFor: "register-repeat-password" }, "Repeat password")),
                React.createElement("button", { id: "register-button", className: "btn btn-primary btn-block mb-3 w-100" }, "Sign Up")))));
};
export default Register;
