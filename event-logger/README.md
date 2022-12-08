# Event Logger Service
## Author
Lucas Bertoni (lucas-bertoni on github)
## Description
The event logger service simply logs all of the events that pass through the event bus service. If the data for any event contains a password, it deletes the password before it logs the event.
## How to Use
- To run this service from scratch (not using Docker), compile the TypeScript by typing `tsc` into the console and then after compliation type `npm start`.
- To run this service from scratch (using Docker Compose), compile the TypeScript by typing `tsc` into the console and then after compilation type

    ```
    docker compose  -f "docker-compose.yml" up -d --build eventlogger
    ```

- Since you probably also want the event logger database running with the event logger service, you probably want to run
  
    ```
    docker compose  -f "docker-compose.yml" up -d --build eventlogs_database eventlogger
    ```
  
  instead
## Interservice Communication
Events Emitted:
  - None
Listened For Events:
  - All since it needs to route events to different services

## Endpoints
- **GET** /getlogs
  - Data Required
    - None
  - Response Codes
    - **200** Successfully retrieved event logs
      - Reponse Data
       
        ```json
          /*
          event: {
            event_id: [string],
            event_type: [string],
            event_data: any{},
            event_timestamp: [string]
          }
          */
          
          {
            events: {
              event[]
            }
          }
        ```

    - **500** Internal Server Error
      - Responde Data
    
        ```json
          There was an error getting the event logs
        ```

- **GET** /gettypes
  - Data Required
    - None
  
  - Response Codes
    - **200** Successfully retrieved event types
      - Response Data
      
        ```json
          {
            eventTypes: {
              string[]
            }
          }
        ```
    
    - **500** Internal Server Error
      - Response Data

        ```json
          There was an error getting the event types
        ```

- **POST** /logevent
  - Data Required

    ```json
    {
      type: [string],
      data: any{}
    }
    ```
  
  - Response Codes
    - **201** Event successfully logged
      - Response Data
      
        ```json
          {
            Event logged
          }
        ```

    - **400** Missing event type field
      - Response Data
      
        ```json
          Event type required
        ```

    - **500** Internal Server Error
      - Response Data

        ```json
          There was an error logging the event
        ```