# Share Service
## Author
Lucas Bertoni (lucas-bertoni on github)
## Description
The share service provides access to single recipes without a link to any user and needs no authentication to access.
## How to Use
- To run this service from scratch (not using Docker), compile the TypeScript by typing `tsc` into the console and then after compliation type `npm start`.
- To run this service from scratch (using Docker Compose), compile the TypeScript by typing `tsc` into the console and then after compilation type

    ```
    docker compose  -f "docker-compose.yml" up -d --build share
    ```

- Since you probably also want the share database running with the share service, you probably want to run
  
    ```
    docker compose  -f "docker-compose.yml" up -d --build share_database share
    ```
  
  instead
## Interservice Communication
Emitted Events:
- None
Listened For Events:
- **IngredientCreated**
  - When an ingredient is created in the ingredient service it is needed so that ingredient can be added to the share ingredients database
- **RecipeCreate**
  - When a recipe is created in the recipe service it is needed so that recipe can be added to the share recipe database

## Endpoints
- **GET** /getrecipe
  - Data Required
    - `rid` in the form `/getrecipe?rid=[number]`
  - Response Codes
    - **200** Successfully retrieved recipe
      - Reponse Data
       
        ```json
          {
            recipe_name: [string],
            ingredients_list: string[]
          }
        ```

    - **400** Recipe ID not provided
      - Reponse Data

        ```json
          Recipe ID required
        ```

    - **401** Recipe not found
      - Responde Data
    
        ```json
          Recipe not found
        ```

    - **500** Internal server error
      - Responde Data
    
        ```json
          There was an error getting the recipe
        ```

- **POST** /ingredientcreated
  - Data Required

    ```json
    {
      type: "IngredientCreated",
      data: {
        ingredient_id: [string],
        ingredient_name: [string]
      }
    }
    ```
  
  - Response Codes
    - **201** Ingredient successfully created
      - Response Data
      
        ```json
          {
            ingredient_id: [string],
            ingredient_name: [string]
          }
        ```

    - **400** Missing fields
      - Response Data
      
        ```json
          Ingredient ID and ingredient name required
        ```
    
    - **500** Internal Server Error
      - Response Data

        ```json
          Ingredient couldn't be added to share service
        ```

- **POST** /recipecreated
  - Data Required

    ```json
    {
      type: "RecipeCreated",
      data: {
        recipe_id: [string],
        recipe_name: [string],
        ingredients_list: string[]
      }
    }
    ```
  
  - Response Codes
    - **201** Recipe successfully created
      - Response Data
      
        ```json
          {
            recipe_name: [string],
            ingredients_list: string[]
          }
        ```

    - **400** Missing fields
      - Response Data
      
        ```json
          Ingredient ID and ingredient name required
        ```

    - **500** Internal Server Error
      - Response Data

        ```json
          Recipe couldn't be added to share service
        ```