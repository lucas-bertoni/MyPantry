var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
const Table = () => {
    const { pantry_id } = useParams();
    const [pantry_name, setPantryName] = useState("");
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
    useEffect(() => {
        const getPantryById = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === "production"
                ? `http://localhost:4004/getpantry` // Change if actually deployed to real web server
                : `http://localhost:4004/getpantry`;
            yield axios
                .get(url, { params: { pantry_id: pantry_id } })
                .then((axiosResponse) => {
                console.log(axiosResponse.data);
                setPantryName(axiosResponse.data.pantry_name);
            })
                .catch((axiosError) => {
                console.log(axiosError.response);
                console.log("There was an error getting the pantry");
            });
            console.log(pantry_name, "pantry_name from getPantryById");
        });
        getPantryById();
    }, [pantry_id]);
    const [ingredients, setIngredients] = useState([]);
    const [ingredients_list, setIngredientsList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const onChange = (e) => {
        setSearchValue(e.target.value);
    };
    const onSearch = (searchTerm) => {
        setSearchValue(searchTerm);
    };
    const getIngredients = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4004/getingredients` // Change if actually deployed to real web server
            : `http://localhost:4004/getingredients`;
        yield axios
            .get(url, { params: { pantry_id: pantry_id } })
            .then((axiosResponse) => {
            console.log(axiosResponse.data);
            setIngredients(axiosResponse.data);
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error getting the ingredients");
        });
    });
    useEffect(() => {
        getIngredients();
    }, [pantry_id]);
    useEffect(() => {
        const getIngredientsList = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === "production"
                ? `http://localhost:4004/getAllIngredientsFromList` // Change if actually deployed to real web server
                : `http://localhost:4004/getAllIngredientsFromList`;
            yield axios
                .get(url)
                .then((axiosResponse) => {
                console.log(axiosResponse.data);
                setIngredientsList(axiosResponse.data);
            })
                .catch((axiosError) => {
                console.log(axiosError.response);
                console.log("There was an error getting the ingredients list");
            });
        });
        getIngredientsList();
    }, []);
    const addIngredient = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4004/addingredient` // Change if actually deployed to real web server
            : `http://localhost:4004/addingredient`;
        yield axios
            .post(url, {
            user_id: user_id,
            pantry_id: pantry_id,
            ingredient_name: searchValue,
        })
            .then((axiosResponse) => {
            console.log(axiosResponse.data);
            getIngredients();
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error adding the ingredient");
        });
    });
    return (React.createElement("div", { className: "container" },
        React.createElement("h1", null, pantry_name),
        React.createElement("h1", null, "Search"),
        React.createElement("div", { className: "search-container" },
            React.createElement("div", { className: "search-inner" },
                React.createElement("input", { type: "text", value: searchValue, onChange: onChange }),
                React.createElement("button", { onClick: () => onSearch("") }, "Clear"),
                React.createElement("button", { onClick: addIngredient }, "Add Ingredient")),
            React.createElement("div", { className: "search-dropdown" }, ingredients_list
                .filter((ingredient) => {
                const ingredientName = ingredient.ingredient_name.toLowerCase();
                const searchValueLower = searchValue.toLowerCase();
                return (searchValue &&
                    ingredientName.startsWith(searchValueLower) &&
                    ingredientName !== searchValueLower);
            })
                .slice(0, 5)
                .map((ingredient) => (React.createElement("div", { className: "dropdown-row", key: ingredient.ingredient_id, onClick: () => onSearch(ingredient.ingredient_name) }, ingredient.ingredient_name)))),
            React.createElement("div", { className: "table-container", key: pantry_id },
                React.createElement("table", { className: "table table-striped" },
                    React.createElement("thead", { className: "table-dark" },
                        React.createElement("tr", null,
                            React.createElement("th", null, "Ingredient"))),
                    React.createElement("tbody", null, ingredients.map((ingredient) => (React.createElement("tr", { key: ingredient.ingredient_id },
                        React.createElement("td", null, ingredient.ingredient_name))))))))));
};
export default Table;
