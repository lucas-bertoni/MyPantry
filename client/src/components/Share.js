// All written by Lucas Bertoni\
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
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
const Share = () => {
    const [recipe, setRecipe] = useState({
        recipe_name: "",
        recipe_description: "",
        ingredients_list: [],
    });
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const recipe_id = parseInt(searchParams.get("rid") || "");
        const getRecipe = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === "production"
                ? "http://localhost:4003/getrecipe" // Change if actually deployed to real web server
                : "http://localhost:4003/getrecipe";
            yield axios
                .get(url, { params: { recipe_id: recipe_id } })
                .then((axiosResponse) => {
                console.log(axiosResponse.data);
                setRecipe(axiosResponse.data);
            })
                .catch((axiosError) => {
                console.log(axiosError.response);
                console.log("There was an error getting the recipe");
            });
        });
        if (recipe_id) {
            getRecipe();
        }
        else {
            console.log("No recipe id provided");
        }
    }, []);
    if (!recipe || !recipe.recipe_name) {
        return (React.createElement("div", { className: "container w-25 mt-5" },
            React.createElement("div", { className: "card m-0" },
                React.createElement("div", { className: "card-title p-3 m-0" },
                    React.createElement("div", { className: "d-flex justify-content-center align-items-center" },
                        React.createElement("h3", null, " No recipe found "))))));
    }
    return (React.createElement("div", { className: "container w-25 mt-5" },
        React.createElement("div", { className: "card" },
            React.createElement("div", { className: "card-title pt-3 mb-0" },
                React.createElement("div", { className: "d-flex justify-content-center align-items-center" },
                    React.createElement("h3", null,
                        " ",
                        recipe.recipe_name,
                        " ")),
                React.createElement("div", null,
                    React.createElement("p", null,
                        " ",
                        recipe.recipe_description,
                        " "))),
            React.createElement("div", { className: "card-body pt-1 mt-1" },
                React.createElement("ul", null,
                    React.createElement(IngredientsList, { ingredients_list: recipe.ingredients_list }))))));
};
const IngredientsList = (props) => {
    return props.ingredients_list.map((ingredient_name, key) => {
        return React.createElement("li", { key: key }, ingredient_name);
    });
};
export default Share;
