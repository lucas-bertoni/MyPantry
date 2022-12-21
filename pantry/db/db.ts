
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const connectionString: string | undefined = process.env.NODE_ENV === 'production' ?
  process.env.PROD_POSTGRES_STRING :
  process.env.DEV_PANTRY_POSTGRES_STRING;

    
export class DatabaseConnection {
    pool!: Pool;

    constructor() {
        try {
            this.pool = new Pool({connectionString});
        } catch (error) {
            console.log('Pool could not be created');
        }
    }

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
        

            CREATE TABLE IF NOT EXISTS pantries (
              pantry_id BIGSERIAL PRIMARY KEY,
              pantry_name VARCHAR
            );
            
            CREATE TABLE IF NOT EXISTS ingredients (
              ingredient_id BIGSERIAL PRIMARY KEY,
              ingredient_name VARCHAR
            );
            
            CREATE TABLE IF NOT EXISTS pantry_ingredients (
              pantry_id BIGINT NOT NULL,
              ingredient_id BIGINT NOT NULL,
              FOREIGN KEY (pantry_id) REFERENCES pantries,
              FOREIGN KEY (ingredient_id) REFERENCES ingredients
            );
            
            CREATE TABLE IF NOT EXISTS user_pantries (
              user_id BIGINT NOT NULL,
              pantry_id BIGINT NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users,
              FOREIGN KEY (pantry_id) REFERENCES pantries
            );`);
        } catch (error) {
            console.log('\nThere was an error connecting to the database');
            console.log(error);
          }
        }
      
        disconnect = async () => {
          await this.pool.end();
        }
      }