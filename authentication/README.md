# Authentication Service
## Author
Lucas Bertoni (lucas-bertoni on github)
## Description
The authentication service is used to register users, login users, and retrieve user data for authorization purposes
## How to Use
- To run this service from scratch (not using Docker), type `npm start`.
- To run this service from scratch (using Docker Compose), compile the TypeScript by typing `tsc` into the console and then after compilation type

    ```
    docker compose  -f "docker-compose.yml" up -d --build authentication
    ```

- Since you probably also want the authentication database running with the authentication service, you probably want to run
  
    ```
    docker compose  -f "docker-compose.yml" up -d --build authentication_database authentication
    ```
  
  instead
## Interservice Communication
Emitted Events:
- **UserCreated**
  - The event emitted when a user successfully registers. This event is sent to the event bus which then sends it to the other services that need it (event logger, pantry, recipe)
- **LoginSuccess**
  - The event emitted when a user successfully logs in. This event is sent to the event bus which then sends it to the other services that need it (event logger)
Listened For Events:
- None

## Endpoints
- **POST** /auth
  - Data Required
    - None, the broswer provides the necessary cookie
  - Response Codes
    - **200** Authentication success
      - Reponse Data
       
        ```json
          {
            user_id: [string],
            email: [string]
          }
        ```

    - **401** Invalid token
      - Reponse Data

        ```json
          Invalid token
        ```

    - **403** No token provided
      - Response Data
    
        ```json
          A token is required for authentication
        ```

- **POST** /login
  - Data Required

    ```json
    {
      email: [string],
      password: [string]
    }
    ```
  
  - Response Codes
    - **200** Login success
      - Response Data

        ```json
        {
          user_id: [string],
          email: [string]
        }
        ```

    - **400** Not all fields required are present
      - Response Data

        ```json
          All fields required
        ```

    - **401** User not found
      - Response Data

        ```json
          User not found
        ```

- **POST** /logout
  - Data Required
    - None, just sets the cookie used for authentication to expired
  - Response Codes
    - **200** Logout success
      - Reponse Data
       
        ```json
          Logged out
        ```

- **POST** /register
  - Data Required

    ```json
    {
      email: [string],
      password: [string]
    }
    ```
  
  - Response Codes
    - **200** Register success
      - Response Data

        ```json
        {
          user_id: [string],
          email: [string]
        }
        ```

    - **400** Not all fields required are present
      - Response Data

        ```json
          All fields required
        ```

    - **401** User already exists
      - Response Data

        ```json
          User already exists
        ```