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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const EventLogs = () => {
    const [role, setRole] = useState(0);
    const [eventLogs, setEventLogs] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    // Get the event logs
    const getEventLogs = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === 'production'
            ? 'http://localhost:4002/getlogs' // Change if actuall deployed to real web server
            : 'http://localhost:4002/getlogs';
        yield axios.get(url)
            .then((axiosResponse) => {
            setEventLogs(axiosResponse.data.events);
        })
            .catch((axiosError) => {
            console.log('There was an error fetching the event logs');
        });
    });
    // Get the event types
    const getEventTypes = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === 'production'
            ? 'http://localhost:4002/gettypes' // Change if actually deployed to real web server
            : 'http://localhost:4002/gettypes';
        yield axios.get(url)
            .then((axiosResponse) => {
            const stringArr = axiosResponse.data.eventTypes.map((obj) => { return obj.event_type; });
            setEventTypes(stringArr);
        })
            .catch((axiosError) => {
            console.log('There was an error fetching the event types');
        });
    });
    const auth = () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.NODE_ENV === 'production'
            ? 'http://localhost:4001/auth' // Change if actually deployed to real web server
            : 'http://localhost:4001/auth';
        yield axios.post(url, {}, { withCredentials: true })
            .then((axiosResponse) => {
            setRole(axiosResponse.data.role);
            if (axiosResponse.data.role === 10) {
                getEventLogs();
                getEventTypes();
            }
            else {
                window.location.href = '/#/home';
            }
        })
            .catch((axiosError) => {
            window.location.href = '/#/login';
        });
    });
    useEffect(() => {
        auth();
    }, []);
    if (role !== 10) {
        return (React.createElement("div", { className: 'd-flex align-items-center justify-content-center w-100' },
            React.createElement("p", null, "Unauthorized")));
    }
    else {
        return (React.createElement("div", { className: 'd-flex align-items-center justify-content-center w-100' },
            React.createElement("div", { className: 'd-flex align-items-center justify-content-center w-75 mt-5' },
                React.createElement(TableList, { eventTypes: eventTypes, eventLogs: eventLogs }))));
    }
};
const renderTable = (events, key) => {
    return (React.createElement("table", { className: 'table table-striped', style: { height: '400px', overflowY: 'auto' }, key: key },
        React.createElement("thead", { className: 'table-dark' },
            React.createElement("tr", null,
                React.createElement("th", { style: { width: '15%' } }, "Event Type"),
                React.createElement("th", { style: { width: '15%' } }, "Event ID"),
                React.createElement("th", { style: { width: '50%' } }, "Event Data"),
                React.createElement("th", { style: { width: '20%' } }, "Event Timestamp (EST)"))),
        React.createElement("tbody", null, 
        // Create a row in the table for each event
        events.map((event) => {
            return (React.createElement("tr", { key: event.event_id },
                React.createElement("td", null, event.event_type),
                React.createElement("td", null, event.event_id),
                React.createElement("td", null, JSON.stringify(event.event_data, null, 2)),
                React.createElement("td", null, event.event_timestamp)));
        }))));
};
const TableList = (props) => {
    // Create 'buckets' for each of the event types
    const buckets = {};
    props.eventTypes.forEach((eventType) => {
        buckets[eventType] = [];
    });
    // Populate the buckets
    let startPos = 0;
    for (let i = 0; i < props.eventTypes.length; ++i) {
        const eventTypeString = props.eventTypes[i];
        for (let j = startPos; j < props.eventLogs.length; ++j) {
            const event = props.eventLogs[j];
            if (event.event_type === eventTypeString) {
                buckets[eventTypeString].push(event);
            }
            else { // The data is sorted so we can speed this up
                startPos = j;
                break;
            }
        }
    }
    // Get the JSX object of all of the rendered tables
    const renderedTables = Object.entries(buckets).map((entry, key) => {
        return renderTable(entry[1], key);
    });
    // Return a div containing all of the render tables
    if (props.eventLogs.length === 0) {
        return (React.createElement("div", null, 'No events'));
    }
    return (React.createElement("div", { style: { height: '800px', overflowY: 'scroll' } }, renderedTables));
};
export default EventLogs;
