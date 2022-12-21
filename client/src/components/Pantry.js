var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
const Pantry = () => {
    const [user_id, setUserID] = useState(0);
    const [email, setEmail] = useState("");
    useEffect(() => {
        const auth = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === "production"
                ? "http://localhost:4001/auth" // Change if actually deployed to real web server
                : "http://localhost:4001/auth";
            yield axios
                .post(url, {}, { withCredentials: true })
                .then((axiosResponse) => {
                setUserID(axiosResponse.data.user_id);
                setEmail(axiosResponse.data.email);
            })
                .catch((axiosError) => {
                window.location.href = "/#/login";
            });
        });
        auth();
    }, []);
    const [pantries, setPantries] = useState([]);
    const [pantry_name, setPantryName] = useState("");
    const [updatePantryName, setUpdatePantryName] = useState("");
    const getPantries = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4004/${user_id}/getpantries` // Change if actually deployed to real web server
            : `http://localhost:4004/${user_id}/getpantries`;
        yield axios
            .get(url, { params: { user_id: user_id } })
            .then((axiosResponse) => {
            setPantries(axiosResponse.data);
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error getting the pantries");
        });
    });
    useLayoutEffect(() => {
        getPantries();
    }, [user_id]);
    const addPantry = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4004/${user_id}/pantrycreated` // Change if actually deployed to real web server
            : `http://localhost:4004/${user_id}/pantrycreated`;
        yield axios
            .post(url, { user_id: user_id, pantry_name: pantry_name })
            .then((axiosResponse) => {
            console.log(axiosResponse.data);
            getPantries();
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error adding the pantry");
        });
        setPantryName("");
    });
    const deletePantry = (pantry_id) => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4004/${user_id}/pantrydeleted` // Change if actually deployed to real web server
            : `http://localhost:4004/${user_id}/pantrydeleted`;
        yield axios
            .post(url, { pantry_id: pantry_id })
            .then((axiosResponse) => {
            console.log(axiosResponse.data);
            getPantries();
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error deleting the pantry");
        });
    });
    const updatePantry = (pantry_id, e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4004/${user_id}/pantryupdated` // Change if actually deployed to real web server
            : `http://localhost:4004/${user_id}/pantryupdated`;
        yield axios
            .post(url, { pantry_id: pantry_id, pantry_name: updatePantryName })
            .then((axiosResponse) => {
            console.log(axiosResponse.data);
            getPantries();
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error updating the pantry");
        });
        setUpdatePantryName("");
    });
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("h1", null, "Pantry"),
                React.createElement("h1", null, user_id))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("div", { className: "card" },
                    React.createElement("div", { className: "card-body" },
                        React.createElement("h5", { className: "card-title" }, "Add Pantry"),
                        React.createElement("div", { className: "form-group" },
                            React.createElement("label", { htmlFor: "pantry_name" }, "Pantry Name"),
                            React.createElement("input", { type: "text", className: "form-control", id: "pantry_name", placeholder: "Enter pantry name", value: pantry_name, onChange: (e) => setPantryName(e.target.value) })),
                        React.createElement("button", { type: "button", className: "btn btn-primary", onClick: (e) => addPantry(e) }, "Add Pantry"))))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("div", { className: "card" },
                    React.createElement("div", { className: "card-body" },
                        React.createElement("h5", { className: "card-title" }, "Pantries"),
                        React.createElement("div", { className: "row" }, pantries.map((pantry) => (React.createElement("div", { className: "col" },
                            React.createElement("div", { className: "card" },
                                React.createElement("div", { className: "card-body" },
                                    React.createElement("h5", { className: "card-title" }, pantry.pantry_name),
                                    React.createElement(Link, { to: `/pantry/${pantry.pantry_id}` },
                                        React.createElement("button", { type: "button", className: "btn btn-primary" }, "View Pantry")),
                                    React.createElement("button", { type: "button", className: "btn btn-danger", onClick: () => deletePantry(pantry.pantry_id) }, "Delete Pantry"),
                                    React.createElement("div", { className: "form-group" },
                                        React.createElement("label", { htmlFor: "pantry_name" }, "Pantry Name"),
                                        React.createElement("input", { type: "updatePantryNameInput", className: "form-control", id: "updatePantryNameInput", placeholder: "Enter pantry name", value: updatePantryName, onChange: (e) => setUpdatePantryName(e.target.value) }),
                                        React.createElement("button", { type: "button", className: "btn btn-primary", onClick: (e) => updatePantry(pantry.pantry_id, e) }, "Update Pantry"))))))))))))));
};
export default Pantry;
