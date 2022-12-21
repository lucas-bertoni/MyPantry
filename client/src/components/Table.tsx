import React, { useState, useEffect, useLayoutEffect } from "react";
import { Route, useParams } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Ingredient {
  ingredient_id: number;
  ingredient_name: string;
}

const Table = () => {
  const { pantry_id } = useParams();
  const [pantry_name, setPantryName] = useState("");

  const [user_id, setUserID] = useState(0);
  const [email, setEmail] = useState("");
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
        })
        .catch((axiosError: AxiosError) => {
          window.location.href = "/#/login";
        });
    };

    auth();
  }, []);

  useEffect(() => {
    const getPantryById = async () => {
      const url =
        process.env.NODE_ENV === "production"
          ? `http://localhost:4004/getpantry` // Change if actually deployed to real web server
          : `http://localhost:4004/getpantry`;

      await axios
        .get(url, { params: { pantry_id: pantry_id } })
        .then((axiosResponse: AxiosResponse) => {
          console.log(axiosResponse.data);
          setPantryName(axiosResponse.data.pantry_name);
        })
        .catch((axiosError: AxiosError) => {
          console.log(axiosError.response);
          console.log("There was an error getting the pantry");
        });

      console.log(pantry_name, "pantry_name from getPantryById");
    };

    getPantryById();
  }, [pantry_id]);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredients_list, setIngredientsList] = useState<Ingredient[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const onSearch = (searchTerm: string) => {
    setSearchValue(searchTerm);
  };

  const getIngredients = async () => {
    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4004/getingredients` // Change if actually deployed to real web server
        : `http://localhost:4004/getingredients`;

    await axios
      .get(url, { params: { pantry_id: pantry_id } })
      .then((axiosResponse: AxiosResponse) => {
        console.log(axiosResponse.data);
        setIngredients(axiosResponse.data);
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error getting the ingredients");
      });
  };
  useEffect(() => {
    getIngredients();
  }, [pantry_id]);

  useEffect(() => {
    const getIngredientsList = async () => {
      const url =
        process.env.NODE_ENV === "production"
          ? `http://localhost:4004/getAllIngredientsFromList` // Change if actually deployed to real web server
          : `http://localhost:4004/getAllIngredientsFromList`;

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

  const addIngredient = async () => {
    const url =
      process.env.NODE_ENV === "production"
        ? `http://localhost:4004/addingredient` // Change if actually deployed to real web server
        : `http://localhost:4004/addingredient`;

    await axios
      .post(url, {
        user_id: user_id,
        pantry_id: pantry_id,
        ingredient_name: searchValue,
      })
      .then((axiosResponse: AxiosResponse) => {
        console.log(axiosResponse.data);
        getIngredients();
      })
      .catch((axiosError: AxiosError) => {
        console.log(axiosError.response);
        console.log("There was an error adding the ingredient");
      });
  };

  return (
    <div className="container">
      <h1>{pantry_name}</h1>
      <h1>Search</h1>
      <div className="search-container">
        <div className="search-inner">
          <input type="text" value={searchValue} onChange={onChange} />
          {/* <button onClick={() => onSearch(searchValue)}>Search</button> */}
          <button onClick={() => onSearch("")}>Clear</button>
          <button onClick={addIngredient}>Add Ingredient</button>
        </div>
        <div className="search-dropdown">
          {ingredients_list
            .filter((ingredient) => {
              const ingredientName = ingredient.ingredient_name.toLowerCase();
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

        <div className="table-container" key={pantry_id}>
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Ingredient</th>
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
  );
};

export default Table;
