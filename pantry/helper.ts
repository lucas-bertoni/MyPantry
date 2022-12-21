import { DatabaseConnection } from './db/db.js';
import { QueryResult } from 'pg';

const dbConn = new DatabaseConnection();
dbConn.connect();


const createPantry = async (pantry_name: string, user_id: number) => {
    try {
       
        const result: QueryResult = await dbConn.pool.query(`
        INSERT INTO pantries (pantry_name)
        VALUES ($1)
        RETURNING pantry_id
        `, [pantry_name]);
        
        const pantry_id = result.rows[0].pantry_id;
        await dbConn.pool.query(`
        INSERT INTO user_pantries (user_id, pantry_id)
        VALUES ($1, $2)
        RETURNING pantry_id
        `, [user_id, pantry_id]);
        return pantry_id;
    } catch (error) {
        console.log(error);
        console.log('Error creating pantry in database');
    }
}


const getUserPantries = async (user_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
          P.pantry_id,
          P.pantry_name
        FROM
          pantries P,
          users U,
          user_pantries UP
        WHERE
            U.user_id = UP.user_id AND
            P.pantry_id = UP.pantry_id AND
            U.user_id = $1
        `, [user_id]);
        return result.rows;
    } catch (error) {
        console.log(error);
        console.log('Error getting user pantries from database');
    }
}

const getUserPantry = async (user_id: number, pantry_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
            P.pantry_id,
            P.pantry_name
        FROM
            pantries P,
            users U,
            user_pantries UP
        WHERE
            U.user_id = UP.user_id AND
            P.pantry_id = UP.pantry_id AND
            U.user_id = $1 AND
            P.pantry_id = $2
        `, [user_id, pantry_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        console.log('Error getting user pantry from database');
    }
}



const getPantryById = async (pantry_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT pantry_id, pantry_name
        FROM pantries
        WHERE pantry_id = $1
        `, [pantry_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        console.log('Error getting pantry by id from database');
    }
}

//delete pantry by id from user_pantries and pantries
const deletePantry = async (pantry_id: number) => {
    try {
        await dbConn.pool.query(`
        DELETE FROM user_pantries
        WHERE pantry_id = $1
        `, [pantry_id]);
        await dbConn.pool.query(`
        DELETE FROM pantries
        WHERE pantry_id = $1
        `, [pantry_id]);
    } catch (error) {
        console.log(error);
        console.log('Error deleting pantry from database');
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

//update 
const updatePantry = async (pantry_id: number, pantry_name: string) => {
    try {
        await dbConn.pool.query(`
        UPDATE pantries
        SET pantry_name = $2
        WHERE pantry_id = $1
        `, [pantry_id, pantry_name]);
    } catch (error) {
        console.log(error);
        console.log('Error updating pantry in database');
    }

}



const addPantryIngredientByName = async (pantry_id: number, ingredient_name: string) => {
    //first get ingredient_id from ingredient_name
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT ingredient_id
        FROM ingredients
        WHERE ingredient_name = $1
        `, [ingredient_name]);
        const ingredient_id = result.rows[0].ingredient_id;
        await dbConn.pool.query(`
        INSERT INTO pantry_ingredients (pantry_id, ingredient_id)
        VALUES ($1, $2)
        
        `, [pantry_id, ingredient_id]);
        
    } catch (error) {
        console.log(error);
        console.log('Error adding pantry ingredient by name to database');
    }
}

const deletePantryIngredient = async (pantry_id: number, ingredient_id: number) => {
    try {
        await dbConn.pool.query(`
        DELETE FROM pantry_ingredients
        WHERE pantry_id = $1 AND ingredient_id = $2
        `, [pantry_id, ingredient_id]);
    } catch (error) {
        console.log(error);
        console.log('Error deleting pantry ingredient from database');
    }
}


//get pantryingredient from pantry
const getPantryIngredient = async (pantry_id: number, ingredient_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
            I.ingredient_id,
            I.ingredient_name
        FROM
            ingredients I,
            pantry_ingredients PI
        WHERE
            I.ingredient_id = PI.ingredient_id AND
            PI.pantry_id = $1 AND
            I.ingredient_id = $2
        `, [pantry_id, ingredient_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        console.log('Error getting pantry ingredient from database');
    }
}


//get all ingredients from pantry
const getAllIngredientsFromPantry = async (pantry_id: number) => {
    try {
        const result: QueryResult = await dbConn.pool.query(`
        SELECT
            I.ingredient_id,
            I.ingredient_name
        FROM
            ingredients I,
            pantry_ingredients PI
        WHERE
            I.ingredient_id = PI.ingredient_id AND
            PI.pantry_id = $1
        `, [pantry_id]);
        return result.rows;
    } catch (error) {
        console.log(error);
        console.log('Error getting all ingredients from pantry in database');
    }
}




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




export { createPantry, getUserPantries, getPantryById, deletePantry, updatePantry, getUserPantry, createUser, getPantryIngredient, addPantryIngredientByName, deletePantryIngredient, initializeIngredientsList, insertIntoIngredientList, getAllIngredientsFromList, getAllIngredientsFromPantry };