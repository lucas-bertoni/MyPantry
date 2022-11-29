// All written by Lucas Bertoni

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const connectionString: string | undefined = process.env.NODE_ENV === 'production' ?
  process.env.PROD_POSTGRES_STRING :
  process.env.DEV_POSTGRES_STRING;

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
        CREATE TABLE IF NOT EXISTS recipes (
          recipe_id BIGSERIAL PRIMARY KEY,
          recipe_name VARCHAR
        );

        CREATE TABLE IF NOT EXISTS ingredients (
          ingredient_id BIGSERIAL PRIMARY KEY,
          ingredient_name VARCHAR
        );

        CREATE TABLE IF NOT EXISTS recipe_ingredients (
          recipe_id BIGINT NOT NULL,
          ingredient_id BIGINT NOT NULL,
          FOREIGN KEY (recipe_id) REFERENCES recipes,
          FOREIGN KEY (ingredient_id) REFERENCES ingredients
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