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
import RecipeCard from "./RecipeCard";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
const Recipes = () => {
    const [user_id, setUserID] = useState(0);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(0);
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
                setRole(axiosResponse.data.role);
            })
                .catch((axiosError) => {
                window.location.href = "/#/login";
            });
        });
        auth();
    }, []);
    const [recipeCards, setRecipeCards] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [showAllIngredients, setShowAllIngredients] = useState(false);
    const addRecipeCard = () => {
        //pass in user_id to recipe card
        setRecipeCards([...recipeCards, React.createElement(RecipeCard, null)]);
    };
    const getAllIngredientsFromPantries = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === "production"
            ? "http://localhost:4005/getallingredientsfrompantries" // Change if actually deployed to real web server
            : "http://localhost:4005/getallingredientsfrompantries";
        yield axios
            .get(url, {
            params: {
                user_id: user_id,
            },
            withCredentials: true,
        })
            .then((axiosResponse) => {
            setIngredients(axiosResponse.data.map((ingredient) => {
                return ingredient.ingredient_name;
            }));
        })
            .catch((axiosError) => {
            console.log(axiosError);
        });
    });
    useEffect(() => {
        getAllIngredientsFromPantries();
    }, [user_id]);
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("h1", null, user_id),
                React.createElement("h1", null, "Recipes"))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("button", { onClick: addRecipeCard }, "Add Recipe"))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" }, recipeCards)),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("h1", null, "All Pantry Items"))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("button", { onClick: () => setShowAllIngredients(!showAllIngredients) }, showAllIngredients ? "Hide Ingredients" : "Show Ingredients"))),
        showAllIngredients && (React.createElement("div", { className: "row", style: { height: "500px", overflow: "auto" } },
            React.createElement("div", { className: "col" },
                React.createElement(InfiniteScroll, { dataLength: ingredients && ingredients.length, next: getAllIngredientsFromPantries, hasMore: true, loader: React.createElement("h4", null, "Loading...") }, ingredients &&
                    ingredients.map((ingredient, index) => (React.createElement("ul", null,
                        React.createElement("div", { key: index }, ingredient))))))))));
};
export default Recipes;
