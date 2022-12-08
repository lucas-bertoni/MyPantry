// All written by Lucas Bertoni

import React, { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Event {
  event_id: string;
  event_type: string;
  event_data: string;
  event_timestamp: string;
}

const EventLogs = () => {
  
  const [role, setRole] = useState<number>(0);
  const [eventLogs, setEventLogs] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  // Get the event logs
  const getEventLogs = async () => {
    const url = process.env.NODE_ENV === 'production'
      ? 'http://localhost:4002/getlogs' // Change if actuall deployed to real web server
      : 'http://localhost:4002/getlogs';

    await axios.get(url)
      .then( (axiosResponse: AxiosResponse) => {
        setEventLogs(axiosResponse.data.events);
      })
      .catch( (axiosError: AxiosError) => {
        console.log('There was an error fetching the event logs');
      });
  };

  // Get the event types
  const getEventTypes = async () => {
    const url = process.env.NODE_ENV === 'production'
      ? 'http://localhost:4002/gettypes' // Change if actually deployed to real web server
      : 'http://localhost:4002/gettypes';

    await axios.get(url)
      .then( (axiosResponse: AxiosResponse) => {
        const stringArr: string[] = axiosResponse.data.eventTypes.map( (obj: { event_type: string}) => { return obj.event_type; } );
        setEventTypes(stringArr);
      })
      .catch( (axiosError: AxiosError) => {
        console.log('There was an error fetching the event types');
      });
  };

  const auth = async () => {
    const url = process.env.NODE_ENV === 'production'
      ? 'http://localhost:4001/auth' // Change if actually deployed to real web server
      : 'http://localhost:4001/auth';

    await axios.post(url, {}, { withCredentials: true })
      .then( (axiosResponse: AxiosResponse) => {
        setRole(axiosResponse.data.role);
        if (axiosResponse.data.role === 10) {
          getEventLogs();
          getEventTypes();
        } else {
          window.location.href = '/#/home';
        }
      })
      .catch( (axiosError: AxiosError) => {
        window.location.href = '/#/login';
      });
  };

  useEffect( () => {
    auth();
  }, []);

  if (role !== 10) {
    return (
      <div className='d-flex align-items-center justify-content-center w-100'>
        <p>Unauthorized</p>
      </div>
    )
  } else {
    return (
      <div className='d-flex align-items-center justify-content-center w-100'>
        <div className='d-flex align-items-center justify-content-center w-75 mt-5'>
          <TableList eventTypes={eventTypes} eventLogs={eventLogs}/>
        </div>
      </div>
    )
  }
}

const renderTable = (events: Event[], key: number) => {
  return (
    <table className='table table-striped' key={key}>
      <thead className='table-dark'>
        <tr>
          <th style={{ width: '15%' }}>Event Type</th>
          <th style={{ width: '15%' }}>Event ID</th>
          <th style={{ width: '50%' }}>Event Data</th>
          <th style={{ width: '20%' }}>Event Timestamp (EST)</th>
        </tr>
      </thead>
      <tbody>
        {
          // Create a row in the table for each event
          events.map( (event: Event) => {
            return (
              <tr key={event.event_id}>
                <td>{event.event_type}</td>
                <td>{event.event_id}</td>
                <td><pre>{JSON.stringify(event.event_data, null, 2)}</pre></td>
                <td>{event.event_timestamp}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

const TableList = (props: any) => {
  // Create 'buckets' for each of the event types
  const buckets: any = {};
  props.eventTypes.forEach( (eventType: string) => {
    buckets[eventType] = [];
  });

  // Populate the buckets
  let startPos: number = 0;
  for (let i: number = 0; i < props.eventTypes.length; ++i) {
    const eventTypeString: string = props.eventTypes[i];
    for (let j: number = startPos; j < props.eventLogs.length; ++j) {
      const event: Event = props.eventLogs[j];
      if (event.event_type === eventTypeString) {
        buckets[eventTypeString].push(event);
      } else { // The data is sorted so we can speed this up
        startPos = j;
        break;
      }
    }
  }

  // Get the JSX object of all of the rendered tables
  const renderedTables = Object.entries(buckets).map( (entry: any, key: number) => {
    return renderTable(entry[1], key);
  });

  // Return a div containing all of the render tables
  if (props.eventLogs.length === 0) {
    return (
      <div>
        {'No events'}
      </div>
    );
  }

  return (
    <div>
      {renderedTables}
    </div>
  );
}

export default EventLogs;