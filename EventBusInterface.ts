// @ts-ignore
import axios, { AxiosError, AxiosResponse } from 'axios';
// @ts-ignore
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

class EventBusInterface {
  register_url = process.env.NODE_ENV === 'production'
    ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/register'
    : 'http://localhost:' + process.env.EVENTBUS_PORT + '/register';

  publish_url = process.env.NODE_ENV === 'production'
    ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/publish'
    : 'http://localhost:' + process.env.EVENTBUS_PORT + '/publish';

  subscribe_url = process.env.NODE_ENV === 'production'
    ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/subscribe'
    : 'http://localhost:' + process.env.EVENTBUS_PORT + '/subscribe';

  service_name: string;
  service_port: string;

  constructor(service_name: string, service_port: string | number) {
    this.service_name = service_name;
    this.service_port = service_port.toString();
  }

  register = async () => {
    console.log(`\nRegistering \'${this.service_name}\' with event bus`);
    
    await axios.post(this.register_url, { service_name: this.service_name, service_port: this.service_port })
    // @ts-ignore
      .then( (axiosResponse) => {
        console.log('Successfully registered with event bus');
      })
      // @ts-ignore
      .catch( (axiosError) => {
        console.log('Unable to register with event bus');
      });
  };

  publish = async (event_types: string[]) => {
    console.log('\nPublishing event types to event bus');
    
    event_types.forEach( async (event_type: string) => {
      await axios.post(this.publish_url, { event_type: event_type })
        .then( (axiosResponse: AxiosResponse) => {
          console.log(`Successfully published \'${event_type}\'`);
        })
        .catch( (axiosError: AxiosError) => {
          console.log('Unable to publish the event types');
          console.log(axiosError.response?.data);
        });
    });
  };

  subscribe = async (event_types: string[]) => {
    console.log('\nSubscribing to events');
    
    event_types.forEach( async (event_type) => {
      await axios.post(this.subscribe_url, { event_type: event_type, service_name: this.service_name, service_port: this.service_port })
        .then( (axiosResponse: AxiosResponse) => {
          console.log(`Successfully subscribed to \'${event_type}\'`);
        })
        .catch( (axiosError: AxiosError) => {
          console.log('Unable to subscribe to the event types');
          console.log(axiosError.response?.data);
        });
    });
  };
}

export default EventBusInterface;