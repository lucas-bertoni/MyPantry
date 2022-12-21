var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
//pass in user_id as a prop
const RecipeCard = () => {
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
    console.log(user_id, "user_id from RecipeCard props");
    const [recipeCreated, setRecipeCreated] = useState(false);
    const [recipeName, setRecipeName] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [recipe_id, setRecipeID] = useState(0);
    // Create a new recipe
    const handleCreate = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4005/${user_id}/addrecipe` // Change if actually deployed to real web server
            : `http://localhost:4005/${user_id}/addrecipe`;
        yield axios
            .post(url, {
            recipe_name: recipeName,
            recipe_description: recipeDescription,
            recipe_ingredients: ingredients,
        })
            .then((axiosResponse) => {
            console.log(axiosResponse.data);
            setRecipeID(axiosResponse.data.recipe_id);
            setRecipeCreated(true);
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error adding the recipe");
        });
    });
    // Delete an existing recipe
    const handleDelete = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === "production"
            ? `http://localhost:4005/${user_id}/deleterecipe` // Change if actually deployed to real web server
            : `http://localhost:4005/${user_id}/deleterecipe`;
        yield axios
            .delete(url, {
            data: {
                recipe_id: recipe_id,
            },
        })
            .then((axiosResponse) => {
            console.log(axiosResponse.data);
        })
            .catch((axiosError) => {
            console.log(axiosError.response);
            console.log("There was an error deleting the recipe");
        });
    });
    const [ingredients, setIngredients] = useState([]);
    const [ingredients_list, setIngredientsList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const onChange = (e) => {
        setSearchValue(e.target.value);
    };
    const onSearch = (searchTerm) => {
        setSearchValue(searchTerm);
        // getIngredientId();
    };
    useEffect(() => {
        const getIngredientsList = () => __awaiter(void 0, void 0, void 0, function* () {
            const url = process.env.NODE_ENV === "production"
                ? `http://localhost:4005/getAllIngredientsFromList` // Change if actually deployed to real web server
                : `http://localhost:4005/getAllIngredientsFromList`;
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
    return (React.createElement("div", { className: "card", style: { width: "18rem" } },
        React.createElement("div", { className: "card-body" },
            React.createElement("h5", { className: "card-title" }, recipeName),
            React.createElement("p", { className: "card-text" }, recipeDescription),
            !recipeCreated && (React.createElement("label", null,
                "Recipe name:",
                React.createElement("input", { type: "text", value: recipeName, onChange: (event) => setRecipeName(event.target.value) }))),
            !recipeCreated && (React.createElement("label", null,
                "Recipe description:",
                React.createElement("textarea", { value: recipeDescription, onChange: (event) => setRecipeDescription(event.target.value) }))),
            React.createElement("label", null,
                React.createElement("div", { className: "search-container" },
                    !recipeCreated && (React.createElement("div", { className: "search-inner" },
                        React.createElement("input", { type: "text", value: searchValue, onChange: onChange }),
                        React.createElement("button", { onClick: () => {
                                onSearch(searchValue);
                                setIngredients([
                                    ...ingredients,
                                    ingredients_list.find((ingredient) => ingredient.ingredient_name.toLowerCase() ===
                                        searchValue.toLowerCase()),
                                ]);
                                setSearchValue("");
                            } }, "Add"),
                        React.createElement("button", { onClick: () => onSearch("") }, "Clear"))),
                    !recipeCreated && (React.createElement("div", { className: "search-dropdown" }, ingredients_list
                        .filter((ingredient) => {
                        const ingredientName = ingredient.ingredient_name.toLowerCase();
                        const searchValueLower = searchValue.toLowerCase();
                        return (searchValue &&
                            ingredientName.startsWith(searchValueLower) &&
                            ingredientName !== searchValueLower);
                    })
                        .slice(0, 5)
                        .map((ingredient) => (React.createElement("div", { className: "dropdown-row", key: ingredient.ingredient_id, onClick: () => onSearch(ingredient.ingredient_name) }, ingredient.ingredient_name))))),
                    React.createElement("div", { className: "add-ingredient" },
                        React.createElement("div", { className: "table-container" },
                            React.createElement("table", { className: "table table-striped" },
                                React.createElement("thead", { className: "table-dark" },
                                    React.createElement("tr", null,
                                        React.createElement("th", { scope: "col" }, "Ingredients: "))),
                                React.createElement("tbody", null, ingredients.map((ingredient) => (React.createElement("tr", { key: ingredient.ingredient_id },
                                    React.createElement("td", null, ingredient.ingredient_name)))))))))),
            recipeCreated ? null : ( //make the create button disappear after the recipe is created
            React.createElement("button", { onClick: handleCreate }, "Create")),
            React.createElement("button", { onClick: handleDelete }, "Delete"))));
};
export default RecipeCard;
