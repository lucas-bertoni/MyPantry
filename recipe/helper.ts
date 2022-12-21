import { DatabaseConnection } from './db/db.js';
import { QueryResult } from 'pg';

const dbConn = new DatabaseConnection();
dbConn.connect();


const createRecipe = async (user_id: number, recipe_name: string, recipe_description: string, recipe_ingredients: string[]) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        INSERT INTO recipes (recipe_name, recipe_description, recipe_ingredients)
        VALUES ($1, $2, $3)
        RETURNING recipe_id
        `, [recipe_name, recipe_description, recipe_ingredients]);

        const recipe_id = result.rows[0].recipe_id;
        await dbConn.pool.query(`
        INSERT INTO user_recipes (user_id, recipe_id)
        VALUES ($1, $2)
        RETURNING recipe_id
        `, [user_id, recipe_id]);
       
          
        return { recipe_id, recipe_name, recipe_description, recipe_ingredients, user_id };
    } catch (error) {
        console.log(error);
        console.log('Error creating recipe in database');
    }

}

//updateRecipe(user_id, recipe_id, recipe_name, recipe_description, recipe_ingredients);

const updateRecipe = async (user_id: number, recipe_id: number, recipe_name: string, recipe_description: string, recipe_ingredients: string[]) => {
    try {
        await dbConn.pool.query(`
        UPDATE recipes
        SET recipe_name = $1, recipe_description = $2, recipe_ingredients = $3
        WHERE recipe_id = $4
        `, [recipe_name, recipe_description, recipe_ingredients, recipe_id]);
    } catch (error) {
        console.log(error);
        console.log('Error updating recipe in database');
    }
}







const getRecipes = async (user_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
            R.recipe_id,
            R.recipe_name,
            R.recipe_description,
            R.recipe_ingredients
        FROM
            recipes R,
            users U,
            user_recipes UR
        WHERE
            U.user_id = UR.user_id AND
            R.recipe_id = UR.recipe_id AND
            U.user_id = $1
        `, [user_id]);
        return result.rows;
    } catch (error) {
        console.log(error);
        console.log('Error getting user recipes from database');
    }
}


const deleteRecipe = async (user_id: number, recipe_id: number) => {
    try {
        await dbConn.pool.query(`
        DELETE FROM user_recipes
        WHERE user_id = $1 AND recipe_id = $2
        `, [user_id, recipe_id]);
        await dbConn.pool.query(`
        DELETE FROM recipes
        WHERE recipe_id = $1
        `, [recipe_id]);
    } catch (error) {
        console.log(error);
        console.log('Error deleting recipe from database');
    }
}




const createUser = async (user_id: number, email: string) => {
    try {
        await dbConn.pool.query(`
        INSERT INTO users (user_id, email)
        VALUES ($1, $2)
        `, [user_id, email]);
    } catch (error) {
        console.log(error);
        console.log('Error creating user in database');
    }
}



const userExists = async (user_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT user_id
        FROM users
        WHERE user_id = $1
        `, [user_id]);
        if (result.rows.length > 0) {
            console.log('User Does exists');
            return true;
        } else {
            console.log('User does not exist');
            return false;
        }
    } catch (error) {
        console.log(error);
        console.log('Error checking if user exists in database');
    }
}

//--------------------------------------------------------------------------------------

const initializeIngredientsList = async () => {
    try {
        await dbConn.pool.query(`
        CREATE TABLE IF NOT EXISTS ingredients (
            ingredient_id SERIAL PRIMARY KEY,
            ingredient_name VARCHAR(255) NOT NULL
        )
        `);
        } catch (error) {
            console.log(error);
            console.log('Error initializing ingredients table in database');
        }
}



const insertIntoIngredientList = async (ingredient_name: string) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        INSERT INTO ingredients (ingredient_name)
        VALUES ($1)
        RETURNING *
        `, [ingredient_name]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        console.log('Error inserting into ingredients table in database');

    }
}



//there is only one ingredients list 
const getAllIngredientsFromList = async () => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
            I.ingredient_id,
            I.ingredient_name
        FROM
            ingredients I
        `);
        return result.rows;
    } catch (error) {
        console.log(error);
        console.log('Error getting all ingredients from database');
    }
}
//--------------------------------------------------------------------------------------

const getAllIngredientsFromRecipe = async (recipe_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
            I.ingredient_id,
            I.ingredient_name
        FROM
            ingredients I,
            recipes R,
            recipe_ingredients RI
        WHERE
            R.recipe_id = RI.recipe_id AND
            I.ingredient_id = RI.ingredient_id AND
            R.recipe_id = $1
        `, [recipe_id]);
        return result.rows;
    } catch (error) {
        console.log(error);
        console.log('Error getting all ingredients from database');
    }
}

const addRecipeIngredientByName = async (recipe_id: number, ingredient_name: string) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT ingredient_id
        FROM ingredients
        WHERE ingredient_name = $1
        `, [ingredient_name]);
        const ingredient_id = result.rows[0].ingredient_id;
        await dbConn.pool.query(`
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
        VALUES ($1, $2)
        `, [recipe_id, ingredient_id]);
    } catch (error) {
        console.log(error);
        console.log('Error adding ingredient to recipe in database');
    }
}

//--------------------------------------------------------------------------------------

const addToLargeIngredients = async (ingredient_id: number, ingredient_name: string, user_id: number) => {
    try {
      // First check if the ingredient exists in the table
      const result: QueryResult = await dbConn.pool.query(`
        SELECT ingredient_id
        FROM large_ingredients
        WHERE ingredient_id = $1 AND user_id = $2
      `, [ingredient_id, user_id]);
  
      if (result.rows.length === 0) {
        // The ingredient does not exist, so add it to the table
        const result: QueryResult = await dbConn.pool.query(`
          INSERT INTO large_ingredients (ingredient_id, ingredient_name, user_id)
          VALUES ($1, $2, $3)
          RETURNING *
        `, [ingredient_id, ingredient_name, user_id]);
        console.log(result.rows[0], "added to large ingredients", ingredient_id, ingredient_name, user_id)
        return result.rows[0];
      } else {
        // The ingredient already exists, so do nothing
        return;
      }
    } catch (error) {
      console.log(error);
      console.log('Error adding ingredient to large ingredients in database');
    }
  }

        

//get all ingredients from large ingredients
const getAllIngredientsFromLargeIngredients = async (user_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
            I.ingredient_id,
            I.ingredient_name
        FROM
            large_ingredients I
        WHERE
            I.user_id = $1
        `, [user_id]);
        return result.rows;

    } catch (error) {
        console.log(error);
        console.log('Error getting all ingredients from database');
    }
}





export {
   
    createRecipe,
    createUser,
    getRecipes,
    deleteRecipe,
    userExists,
    initializeIngredientsList,
    insertIntoIngredientList,
    getAllIngredientsFromList,
    getAllIngredientsFromRecipe,
    addRecipeIngredientByName,
    updateRecipe,
    addToLargeIngredients,
  
    getAllIngredientsFromLargeIngredients


}