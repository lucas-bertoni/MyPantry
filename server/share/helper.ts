// All written by Lucas Bertoni

import { QueryResult } from 'pg';
import { DatabaseConnection } from './db/db';

const dbConn = new DatabaseConnection();
dbConn.connect();

const getRecipe = async (recipeid: number) => {
  try {

    const result: QueryResult = await dbConn.pool.query(`
      SELECT
        *
      FROM
        recipes R,
        ingredients I,
        recipe_ingredients RI
      WHERE
        R.recipe_id = RI.recipe_id AND
        I.ingredient_id = RI.ingredient_id AND
        recipe_id = $1
    ;`, [recipeid]);

    return result.rowCount === 0 ? false : result.rows[0];

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);

  }
}

export { getRecipe };