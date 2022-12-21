import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const Recipes = () => {
  const [user_id, setUserID] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(0);

  useEffect(() => {
    const auth = async () => {
      const url =
        process.env.NODE_ENV === "production"
          ? "http://localhost:4001/auth" // Change if actually deployed to real web server
          : "http://localhost:4001/auth";

      await axios
        .post(url, {}, { withCredentials: true })
        .then((axiosResponse: AxiosResponse) => {
          setUserID(axiosResponse.data.user_id);
          setEmail(axiosResponse.data.email);
          setRole(axiosResponse.data.role);
        })
        .catch((axiosError: AxiosError) => {
          window.location.href = "/#/login";
        });
    };

    auth();
  }, []);
  interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
  }
  const [recipeCards, setRecipeCards] = useState<JSX.Element[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const addRecipeCard = () => {
    //pass in user_id to recipe card
    setRecipeCards([...recipeCards, <RecipeCard />]);
  };

  const getAllIngredientsFromPantries = async () => {
    const url =
      process.env.NODE_ENV === "production"
        ? "http://localhost:4005/getallingredientsfrompantries" // Change if actually deployed to real web server
        : "http://localhost:4005/getallingredientsfrompantries";

    await axios
      .get(url, {
        params: {
          user_id: user_id,
        },
        withCredentials: true,
      })
      .then((axiosResponse: AxiosResponse) => {
        setIngredients(
          axiosResponse.data.map((ingredient: Ingredient) => {
            return ingredient.ingredient_name;
          })
        );
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError);
      });
  };

  useEffect(() => {
    getAllIngredientsFromPantries();
  }, [user_id]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>{user_id}</h1>
          <h1>Recipes</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button onClick={addRecipeCard}>Add Recipe</button>
        </div>
      </div>
      <div className="row">
        <div className="col">{recipeCards}</div>
      </div>
      <div className="row">
        <div className="col">
          <h1>All Pantry Items</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button onClick={() => setShowAllIngredients(!showAllIngredients)}>
            {showAllIngredients ? "Hide Ingredients" : "Show Ingredients"}
          </button>
        </div>
      </div>

      {showAllIngredients && (
        <div className="row" style={{ height: "500px", overflow: "auto" }}>
          <div className="col">
            <InfiniteScroll
              dataLength={ingredients && ingredients.length}
              next={getAllIngredientsFromPantries}
              hasMore={true}
              loader={<h4>Loading...</h4>}
            >
              {ingredients &&
                ingredients.map((ingredient, index) => (
                  <ul>
                    <div key={index}>{ingredient}</div>
                  </ul>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
