import React, { useEffect, useState, useLayoutEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
//pass in user_id as a prop

const RecipeCard = () => {
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

  console.log(user_id, "user_id from RecipeCard props");

  const [recipeCreated, setRecipeCreated] = useState(false);

  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");

  const [recipe_id, setRecipeID] = useState(0);

  // Create a new recipe
  const handleCreate = async () => {
    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4005/${user_id}/addrecipe` // Change if actually deployed to real web server
        : `http://localhost:4005/${user_id}/addrecipe`;

    await axios
      .post(url, {
        recipe_name: recipeName,
        recipe_description: recipeDescription,
        recipe_ingredients: ingredients,
      })
      .then((axiosResponse: AxiosResponse) => {
        console.log(axiosResponse.data);
        setRecipeID(axiosResponse.data.recipe_id);
        setRecipeCreated(true);
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error adding the recipe");
      });
  };

  // Delete an existing recipe
  const handleDelete = async () => {
    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4005/${user_id}/deleterecipe` // Change if actually deployed to real web server
        : `http://localhost:4005/${user_id}/deleterecipe`;

    await axios
      .delete(url, {
        data: {
          recipe_id: recipe_id,
        },
      })
      .then((axiosResponse: AxiosResponse) => {
        console.log(axiosResponse.data);
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error deleting the recipe");
      });
  };

  //----------------------------------------------
  interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
  }

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredients_list, setIngredientsList] = useState<Ingredient[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSearch = (searchTerm: string) => {
    setSearchValue(searchTerm);
    // getIngredientId();
  };

  useEffect(() => {
    const getIngredientsList = async () => {
      const url =
        process.env.NODE_ENV === "production"
          ? `http://localhost:4005/getAllIngredientsFromList` // Change if actually deployed to real web server
          : `http://localhost:4005/getAllIngredientsFromList`;

      await axios
        .get(url)
        .then((axiosResponse: AxiosResponse) => {
          console.log(axiosResponse.data);
          setIngredientsList(axiosResponse.data);
        })
        .catch((axiosError: AxiosError) => {
          console.log(axiosError.response);
          console.log("There was an error getting the ingredients list");
        });
    };
    getIngredientsList();
  }, []);

  return (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{recipeName}</h5>
        <p className="card-text">{recipeDescription}</p>
        {!recipeCreated && (
          <label>
            Recipe name:
            <input
              type="text"
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </label>
        )}
        {!recipeCreated && (
          <label>
            Recipe description:
            <textarea
              value={recipeDescription}
              onChange={(event) => setRecipeDescription(event.target.value)}
            />
          </label>
        )}

        <label>
          <div className="search-container">
            {!recipeCreated && (
              <div className="search-inner">
                <input type="text" value={searchValue} onChange={onChange} />
                <button
                  onClick={() => {
                    onSearch(searchValue);
                    setIngredients([
                      ...ingredients,
                      ingredients_list.find(
                        (ingredient) =>
                          ingredient.ingredient_name.toLowerCase() ===
                          searchValue.toLowerCase()
                      ) as Ingredient,
                    ]);
                    setSearchValue("");
                  }}
                >
                  Add
                </button>

                <button onClick={() => onSearch("")}>Clear</button>
              </div>
            )}
            {!recipeCreated && (
              <div className="search-dropdown">
                {ingredients_list
                  .filter((ingredient) => {
                    const ingredientName =
                      ingredient.ingredient_name.toLowerCase();
                    const searchValueLower = searchValue.toLowerCase();
                    return (
                      searchValue &&
                      ingredientName.startsWith(searchValueLower) &&
                      ingredientName !== searchValueLower
                    );
                  })
                  .slice(0, 5)
                  .map((ingredient) => (
                    <div
                      className="dropdown-row"
                      key={ingredient.ingredient_id}
                      onClick={() => onSearch(ingredient.ingredient_name)}
                    >
                      {ingredient.ingredient_name}
                    </div>
                  ))}
              </div>
            )}

            <div className="add-ingredient">
              <div className="table-container">
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">Ingredients: </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient) => (
                      <tr key={ingredient.ingredient_id}>
                        <td>{ingredient.ingredient_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </label>
        {recipeCreated ? null : ( //make the create button disappear after the recipe is created
          <button onClick={handleCreate}>Create</button>
        )}

        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default RecipeCard;
