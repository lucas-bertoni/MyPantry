// All written by Lucas Bertoni

import { QueryResult } from 'pg';
import { DatabaseConnection } from './db/db';

const dbConn = new DatabaseConnection();
dbConn.connect();

const getRecipe = async (recipe_id: number) => {
  try {

    const result: QueryResult = await dbConn.pool.query(`
      SELECT
        R.recipe_name,
        I.ingredient_name
      FROM
        recipes R,
        ingredients I,
        recipe_ingredients RI
      WHERE
        R.recipe_id = RI.recipe_id AND
        I.ingredient_id = RI.ingredient_id AND
        R.recipe_id = $1
    ;`, [recipe_id]);

    return result.rowCount === 0 ? false : result.rows;

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);

  }
};

const addRecipe = async (recipe_id: number, recipe_name: string, ingredients_list: number[]) => {
  await dbConn.pool.query(`
    INSERT INTO
      recipes (recipe_id, recipe_name)
    VALUES
      ($1, $2)
  ;`, [recipe_id, recipe_name]);

  ingredients_list.forEach( async (ingredient_id: number) => {
    await dbConn.pool.query(`
      INSERT INTO
        recipe_ingredients (recipe_id, ingredient_id)
      VALUES
        ($1, $2)
    ;`, [recipe_id, ingredient_id]);
  });

  return {
    recipe_id,
    recipe_name,
    ingredients_list
  }
};

const addIngredient = async (ingredient_id: number, ingredient_name: string) => {
  const result: QueryResult = await dbConn.pool.query(`
    INSERT INTO
      ingredients (ingredient_id, ingredient_name)
    VALUES
      ($1, $2)
    RETURNING
      *
  ;`, [ingredient_id, ingredient_name]);

  return result.rows[0];
};

export { addIngredient, addRecipe, getRecipe };