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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const Home = () => {
    const [userid, setUserID] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(0);
    useEffect(() => {
        const auth = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === 'production' ?
                'http://localhost:4001/auth' : // Change if actually deployed to real web server
                'http://localhost:4001/auth';
            yield axios.post(url, {}, { withCredentials: true })
                .then((axiosResponse) => {
                setUserID(axiosResponse.data.userid);
                setEmail(axiosResponse.data.email);
                setRole(axiosResponse.data.role);
            })
                .catch((axiosError) => {
                window.location.href = '/#/login';
            });
        });
        auth();
    }, []);
    if (!email) {
        return (React.createElement("div", { className: 'd-flex align-items-center justify-content-center' },
            React.createElement("p", null, "Unauthorized")));
    }
    else {
        return (React.createElement("div", null,
            React.createElement("div", { className: 'd-flex align-items-center justify-content-center' },
                React.createElement("p", null,
                    "User ID: ",
                    userid)),
            React.createElement("div", { className: 'd-flex align-items-center justify-content-center' },
                React.createElement("p", null,
                    "Email: ",
                    email)),
            React.createElement("div", { className: 'd-flex align-items-center justify-content-center' },
                React.createElement("p", null,
                    "Role: ",
                    role)),
            React.createElement("div", { className: 'd-flex align-items-center justify-content-center' },
                React.createElement("a", { className: 'btn btn-primary', href: '/#/logout', role: 'button' }, "Logout"))));
    }
};
export default Home;
