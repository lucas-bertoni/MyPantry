// All written by Lucas Bertoni

import { QueryResult } from 'pg';
import { DatabaseConnection } from './db/db.js';

const dbConn = new DatabaseConnection();
dbConn.connect();

const logEvent = async (event: any) => {
  try {

    await dbConn.pool.query(`
      INSERT INTO
        events (event_type, event_data)
      VALUES
        ($1, $2)
    ;`, [event.type, event.data]);

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);

  }
};

const getEventLogs = async () => {
  try {

    const result: QueryResult = await dbConn.pool.query(`
      SELECT
        eventid,
        event_type,
        event_data,
        to_char(event_timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'EST', 'MM/DD/YYYY-HH24:MI') AS event_timestamp
      FROM
        events
      ORDER BY
        event_type,
        event_timestamp DESC
    ;`);

    return result.rows;

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);

  }
};

const getEventTypes = async () => {
  try {

    const result: QueryResult = await dbConn.pool.query(`
      SELECT
        DISTINCT(event_type)
      FROM
        events
      ORDER BY
        event_type
    ;`);

    return result.rows;

  } catch (error) {

    console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
    console.log(error);
    
  }
};

export { logEvent, getEventLogs, getEventTypes };