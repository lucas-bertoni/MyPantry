// All written by Lucas Bertoni\

interface Recipe {
  recipe_name: string;
  ingredients_list: string[];
};

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Share = () => {

  const [recipe, setRecipe] = useState<Recipe>({ recipe_name: '', ingredients_list: [] });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect( () => {
    const recipe_id = parseInt(searchParams.get('rid') || '');

    const getRecipe = async () => {
      const url = process.env.NODE_ENV === 'production'
        ? 'http://localhost:4003/getrecipe' // Change if actually deployed to real web server
        : 'http://localhost:4003/getrecipe';

      await axios.get(url, { params: { recipe_id: recipe_id } })
        .then( (axiosResponse: AxiosResponse) => {
          setRecipe(axiosResponse.data);
        })
        .catch( (axiosError: AxiosError) => {
          console.log(axiosError.response);
          console.log('There was an error getting the recipe');
        });
    }

    if (recipe_id) {
      getRecipe();
    } else {
      console.log('No recipe id provided');
    }
  }, []);

  if (!recipe || !recipe.recipe_name) {
    return (
      <div className='container w-25 mt-5'>
      <div className='card m-0'>
        <div className='card-title p-3 m-0'>
          <div className='d-flex justify-content-center align-items-center'>
            <h3> No recipe found </h3>
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className='container w-25 mt-5'>
      <div className='card'>
        <div className='card-title pt-3 mb-0'>
          <div className='d-flex justify-content-center align-items-center'>
            <h3> { recipe.recipe_name } </h3>
          </div>
        </div>
        <div className='card-body pt-1 mt-1'>
          <ul>
            <IngredientsList ingredients_list={recipe.ingredients_list} />
          </ul>
        </div>
      </div>
    </div>
  );
};

const IngredientsList = (props: any) => {
  return props.ingredients_list.map( (ingredient_name: string, key: number) => {
    return (
      <li key={key}>
        { ingredient_name }
      </li>
    )
  });
};

export default Share;
