import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const connectionString: string | undefined = process.env.NODE_ENV === 'production'
  ? process.env.PROD_POSTGRES_STRING
  : process.env.DEV_EVNTLGS_POSTGRES_STRING;

export class DatabaseConnection {
  pool!: Pool;

  constructor() {
    try {
      console.log('Attempting to connect to event logs db at: ' + connectionString);
      this.pool = new Pool({connectionString});
    } catch (error) {
      console.log('Pool could not be created');
    }
  }

  connect = async () => {
    try {
      await this.pool.connect();
      this.pool.query(`
        CREATE TABLE IF NOT EXISTS events (
          event_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          event_type VARCHAR,
          event_data JSON DEFAULT NULL,
          event_timestamp TIMESTAMP DEFAULT NOW()
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