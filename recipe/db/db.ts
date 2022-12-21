
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const connectionString: string | undefined = process.env.NODE_ENV === 'production' ?
  process.env.PROD_POSTGRES_STRING :
  process.env.DEV_RECIPE_POSTGRES_STRING;

    
export class DatabaseConnection {
    pool!: Pool;

    constructor() {
        try {
            this.pool = new Pool({connectionString});
        } catch (error) {
            console.log('Pool could not be created');
        }
    }


  //   const addToLargeIngredients = async (ingredient_id: number, ingredient_name: string) => {
  //     try {
  //        const result: QueryResult = await dbConn.pool.query(`
  //         INSERT INTO large_ingredients (ingredient_id, ingredient_name)
  //         VALUES ($1, $2)
  //         `, [ingredient_id, ingredient_name]);
  
  //         return result.rows[0];
  
  //     } catch (error) {
  //         console.log(error);
  //         console.log('Error adding ingredient to large ingredients in database');
  //     }
  // }
  //the ingredient_id in addToLargeIngredients references the ingredient_id in the ingredients table
    connect = async () => {
        try {
            await this.pool.connect();
            this.pool.query(`
            CREATE TABLE IF NOT EXISTS users (
              user_id BIGSERIAL PRIMARY KEY,
              email VARCHAR,
              password VARCHAR,
              role INT DEFAULT 0,
              token VARCHAR
            );
            CREATE TABLE IF NOT EXISTS recipes (
              recipe_id BIGSERIAL PRIMARY KEY,
              recipe_name VARCHAR,
              recipe_description VARCHAR,
              recipe_ingredients VARCHAR
            );
            CREATE TABLE IF NOT EXISTS user_recipes (
              user_id BIGINT REFERENCES users(user_id),
              recipe_id BIGINT REFERENCES recipes(recipe_id),
              PRIMARY KEY (user_id, recipe_id)
            );

            CREATE TABLE IF NOT EXISTS recipe_ingredients (
              recipe_id BIGINT REFERENCES recipes(recipe_id),
              ingredient_id BIGINT REFERENCES ingredients(ingredient_id),
              PRIMARY KEY (recipe_id, ingredient_id)
            );

            CREATE TABLE IF NOT EXISTS ingredients (
              ingredient_id BIGSERIAL PRIMARY KEY,
              ingredient_name VARCHAR
            );

           
            CREATE TABLE IF NOT EXISTS large_ingredients (
              ingredient_id BIGINT REFERENCES ingredients(ingredient_id),
              ingredient_name VARCHAR,
              user_id BIGINT REFERENCES users(user_id),
              PRIMARY KEY (ingredient_id, user_id)
            );
            `);


      
            

        } catch (error) {
            console.log('\nThere was an error connecting to the database');
            console.log(error);
          }
        }
      
        disconnect = async () => {
          await this.pool.end();
        }
      }

