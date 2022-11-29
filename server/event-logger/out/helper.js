"use strict";
// All written by Lucas Bertoni
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventTypes = exports.getEventLogs = exports.logEvent = void 0;
const db_js_1 = require("./db/db.js");
const dbConn = new db_js_1.DatabaseConnection();
dbConn.connect();
const logEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbConn.pool.query(`
      INSERT INTO
        events (event_type, event_data)
      VALUES
        ($1, $2)
    ;`, [event.type, event.data]);
    }
    catch (error) {
        console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
        console.log(error);
    }
});
exports.logEvent = logEvent;
const getEventLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConn.pool.query(`
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
    }
    catch (error) {
        console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
        console.log(error);
    }
});
exports.getEventLogs = getEventLogs;
const getEventTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConn.pool.query(`
      SELECT
        DISTINCT(event_type)
      FROM
        events
      ORDER BY
        event_type
    ;`);
        return result.rows;
    }
    catch (error) {
        console.log('\nCouldn\'t execute query because the pool couldn\'t connect to the database');
        console.log(error);
    }
});
exports.getEventTypes = getEventTypes;
