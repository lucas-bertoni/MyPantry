# Event Bus Service
## Author
Lucas Bertoni (lucas-bertoni on github)
## Description
The event bus is used to disperse events created by services to other services that request to know when certain events happen
## How to Use
- To run this service from scratch (not using Docker), type `npm start`.
- To run this service from scratch (using Docker Compose), compile the TypeScript by typing `tsc` into the console and then after compilation type

    ```
    docker compose  -f "docker-compose.yml" up -d --build event-bus
    ```
- This service uses a publisher-subscriber model. If a service would like to use the event bus it must first register with it using the `/register` endpoint.
  Once a service is registered, it can publish event types. For example, the Authentication service publishes the `UserCreated` event type which other services can then subscribe to.
  When a service subscribes to an event, any time that event comes into the event bus through the `/events` endpoint, it will be sent that event by the eventbus.
## Interservice Communication


## Endpoints
- **POST** /register
  - Data Required
    
    ```json
      {
        service_name: [string],
        service_port: [string]
      }
    ```

  - Response Codes
    - **201** Register success
      - Reponse Data
        
        ```json
          The [service_name]:[service_port] service was successfully registered with the event bus
        ```

    - **400** Not all required fields are present
      - Reponse Data

        ```json
          Service name and port required
        ```

    - **405** Service already registered
      - Response Data
    
        ```json
          The [service_name]:[service_port] service could not be registered because the service is already registered
        ```
    
    - **500** Internal server error
      - Response Data

          ```json
            Internal server error
          ```

- **POST** /publish
  - Data Required

    ```json
    {
      event_type: [string]
    }
    ```
  
  - Response Codes
    - **201** Event type published
      - Response Data

        ```json
          The [event_type] event was successfully published to the event bus
        ```

    - **400** Not all fields required are present
      - Response Data

        ```json
          Event type required
        ```

    - **405** Event type already published
      - Response Data

        ```json
          The [event_type] event was unable to be published to the event bus because an event with that type already exists
        ```

    - **500** Internal server error
      - Response Data

          ```json
            Internal server error
          ```

- **POST** /subscribe
  - Data Required

    ```json
    {
      event_type: [string],
      service_name: [string],
      service_port: [string]
    }
    ```
  
  - Response Codes
    - **201** Service subscribed to event type
      - Response Data

        ```json
          [service_name]:[service_port] successfully subscribed to [event_type] event
        ```

    - **400** Not all fields required are present
      - Response Data

        ```json
          Service name, service port, and event type required
        ```

    - **405** Event type doesn't exist OR service doesn't exist OR service is already subscribed
      - Response Data

        ```json
          [service_name]:[service_port] was unable to subscribe to [event_type] event because (one of the above reasons)
        ```

    - **500** Internal server error
      - Response Data

          ```json
            Internal server error
          ```

- **POST** /events
  - Data Required

    ```json
    {
      type: [string],
      data: {any}
    }
    ```
  
  - Response Codes
    - **201** Data sent to all subscribed services
      - Response Data

        ```json
          Data successfully sent
        ```

    - **400** Not all fields required are present
      - Response Data

        ```json
          Event type required
        ```

    - **405** Unable to send data to some (or all) services
      - Response Data

        ```json
          The data was unable to be sent to some (or all) services because an event with that type does not exist
        ```

    - **500** Internal server error
      - Response Data

          ```json
            Internal server error
          ```