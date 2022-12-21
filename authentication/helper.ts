// All written by Lucas Bertoni

import { DatabaseConnection } from './db/db.js';
import bcrypt from 'bcrypt';
import { QueryResult } from 'pg';

const dbConn = new DatabaseConnection();
dbConn.connect();

const getUserByID = async (user_id: number) => {
  try {

    const result: QueryResult = await dbConn.pool.query(`
      SELECT
        *
      FROM
        users
      WHERE
        user_id = $1
    ;`, [user_id]);

    return result.rowCount === 0 ? false : result.rows[0];

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);

  }
};

const userExists = async (email: string) => {
  try {

    const result: QueryResult = await dbConn.pool.query(`
      SELECT
        *
      FROM
        users
      WHERE
        email = $1
    ;`, [email.toLowerCase()]);

    return result.rowCount === 0 ? false : result.rows[0];

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);

  }
}

const matchPassword = (password: string, hashPassword: string) => {

  const match = bcrypt.compare(password, hashPassword);
  return match;

};

const createUser = async (email: string, password: string) => {
  const salt: string = await bcrypt.genSalt(10);
  const hash: string = await bcrypt.hash(password, salt);

  try {

    const result: QueryResult = await dbConn.pool.query(`
      INSERT INTO
        users(email, password)
      VALUES
        ($1, $2)
      RETURNING *
    ;`, [email.toLowerCase(), hash]);

    return result.rowCount === 0 ? false : result.rows[0];

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);

  }
};

const setToken = async (user_id: number, token: string) => {
  try {

    await dbConn.pool.query(`
      UPDATE
        users
      SET
        token = $1
      WHERE
        user_id = $2
    ;`, [token, user_id]);

  } catch (error) {

    console.log('\nThere was an error setting the user\'s token');
    console.log(error);
    
  }
};

export { getUserByID, userExists, matchPassword, createUser, setToken };