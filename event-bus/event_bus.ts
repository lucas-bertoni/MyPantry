// All written by Lucas Bertoni

import axios, { AxiosError } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

interface Service {
  service_name: string;
  service_port: string;
};

interface Event {
  type: string;
  subscribers: Service[];
  subscribe: (service: Service) => any;
  unsubscribe: (service: Service) => any;
  sendData: (data: any) => any;
};

class EventBus {

  services: Service[];
  events: Event[];

  constructor() {
    this.services = [];
    this.events = [];
  }

  // Register a service with the event bus so it (the service) can be sent events
  register = (service_name: string, service_port: string) => {
    const exists = this.services.some( (service: Service) => {
      return service.service_port === service_port;
    });

    if (exists) return { success: false, message: 'A service with that port number already exist' };

    this.services.push({service_name, service_port});

    return { success: true, message: '' };
  }



  // Publish an event type so that it can be used by the event bus
  publish = (event_type: string) => {
    // Check if the event type already exists
    const exists: boolean = this.events.some( (event: Event) => {
      return event.type === event_type;
    });

    if (exists) return { success: false, message: 'An event with that type already exists' };

    // Create the new event (this should probably be its own class but idc lol)
    const new_event: Event = {
      type: event_type,
      subscribers: [],
      subscribe(service: Service) {
        // Check if the service is already subscribed
        const exists: boolean = this.subscribers.some( (existing_service: Service) => {
          return existing_service.service_name === service.service_name;
        });

        // If the service isn't already subscribed, subscribe it
        if (!exists) {
          this.subscribers.push(service);
          return true;
        }

        return false;
      },
      unsubscribe(service: Service) {
        // Find the index of the subscribed services in the subscibers array
        let idx = -1;
        this.subscribers.some( (existing_service: Service) => {
          ++idx;
          return existing_service.service_name === service.service_name;
        });

        // If the subsciber exists in the subscribers array, remove it
        if (idx > -1) {
          this.subscribers.splice(idx, 1);
          return true;
        }

        return false;
      },
      sendData(data: any) {
        const failed: string[] = [];

        this.subscribers.forEach( (service: Service) => {
          const url = process.env.NODE_ENV === 'production'
            ? 'http://' + service.service_name + ':' + service.service_port + '/events'
            : 'http://localhost:' + service.service_port + '/events';
          console.log('Sending data to ' + url);
          try {
            axios.post(url, { type: this.type, data: data })
              .catch( (axiosError: AxiosError) => {
                console.log('Failed to send data');
                console.log(axiosError);
                failed.push(url);
              });
          } catch (error) {
            // Just here so it doesn't crash
          }
        });

        return failed;
      }
    };

    this.events.push(new_event);

    return { success: true, message: '' };
  }



  // Subscribe an existing service to a specific event so that it receives that event
  // when the event bus receives it
  subscribe = (event_type: string, service_name: string, service_port: string) => {
    // Check if the event that the service wants to subscribe to exists
    let idx = -1;
    this.events.some( (events: Event) => {
      ++idx;
      return events.type === event_type;
    });

    const event = this.events[idx];

    // idx will get to the last index of the array if the event type doesn't exist
    // so we need to check if the event has the correct event type
    if (event.type !== event_type) return { success: false, message: 'An event with that type does not exist' };
    
    // Check if the service that wants to be subscribed to the event exists
    idx = -1;
    this.services.some( (service: Service) => {
      ++idx;
      return service.service_name === service_name && service.service_port === service_port;
    });

    if (idx < 0) return { success: false, message: 'A service with that name does not exist' };
    
    const service = this.services[idx];

    if (event.subscribe(service)) {
      return { success: true, message: '' };
    }
    
    return { success: false, message: 'The service was already subscribed' };
  }



  // Unsubscribe an existing service from specific event so that it stops receiving that event
  // when the event bus receives it
  unsubscribe = (event_type: string, service_name: string, service_port: string) => {
    // Check if the event that the service wants to unsubscribe from exists
    let idx = -1;
    this.events.some( (events: Event) => {
      ++idx;
      return events.type === event_type;
    });

    if (idx < 0) return { success: false, message: 'An event with that type does not exist' };

    const event = this.events[idx];
    
    // Check if the service that wants to be unsubscribed from the event exists
    idx = -1;
    this.services.some( (service: Service) => {
      ++idx;
      return service.service_name === service_name && service.service_port === service_port;
    });

    if (idx < 0) return { success: false, message: 'A service with that name does not exist' };
    
    const service = this.services[idx];

    if (event.unsubscribe(service)) {
      return { success: true, message: '' };
    }
    
    return { success: false, message: 'The service was already not subscribed' };
  }



  // When an event gets sent to the event bus, send it to the services it needs to go to
  async sendEvent(event_type: string, event_data: any) {
    let idx = -1;
    this.events.some( (event: Event) => {
      ++idx;
      return event.type === event_type;
    });

    if (idx === -1) return { success: false, message: 'An event with that type does not exist' };

    // TODO: check if all of the services get sent the data that need it
    const failed_to_send = this.events[idx].sendData(event_data);
    if (failed_to_send.length === 0) {
      return { success: true, message: '' };
    }

    return { success: false, message: 'Failed to send the data to some services', failed: failed_to_send };
  }
}

export default EventBus;