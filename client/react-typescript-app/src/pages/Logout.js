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
import { useEffect } from 'react';
import axios from 'axios';
const Logout = () => {
    useEffect(() => {
        const tryLogout = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === 'production'
                ? 'http://localhost:4001/logout' // Change if actually deployed to real web server
                : 'http://localhost:4001/logout';
            yield axios.post(url, {}, { withCredentials: true })
                .then((axiosResponse) => {
                if (axiosResponse.status === 200) {
                    window.location.href = '/#/login';
                }
            })
                .catch((axiosErrorT) => {
                console.log('There was an error logging out');
            });
        });
        tryLogout();
    }, []);
    return null;
};
export default Logout;
