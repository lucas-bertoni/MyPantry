Recipe Service

Author: Alex Bowman (bowmana on github)

Description:

The recipe service is a tool for managing user recipes. It allows users to create and manage recipes by adding ingredients to each of their recipes and saving them. This service also has a full dropdown list of ingredients from every pantry that the user has access to. This is intended for the user to see what ingredients are available to them as they are creating a recipe.

How to Use:

To run the recipe service from scratch (not using Docker), type npm start in the console.

To run the recipe service using Docker Compose, compile the TypeScript by typing tsc in the console, then type docker-compose -f "docker-compose.yml" up -d --build recipe to run the service.

Interservice Communication:

The recipe service communicates with the event bus service to publish events when a recipe is created. It also uses the event bus to subscribe to the user created event to create unique recipes for each user. It is also subscribed to the pantry created event to recieve all ingredients available to that user from within their pantries. The published recipe created event is used by the rshare service to get the recipe data and then be shared to anyone.

Endpoints:

POST /events: This endpoint receives events from the event bus service and redirects them to the appropriate route based on the event type.

POST /usercreated: This endpoint receives UserCreated events and creates a new user in the database using the user_id and email data provided in the event. It returns the created user.

POST /pantrycreated: This endpoint receives PantryCreated events and creates new ingredients in the database using the ingredients data provided in the event. It also associates the ingredients with the user specified by the user_id in the event.

POST /:user_id/addrecipe: This endpoint creates a new recipe using the provided data and associates it with the user specified by user_id. It returns the created recipe.

POST /addrecipe

Data Required

{ recipe_name: [string] , recipe_description: [string] , recipe_ingredients: Ingredient[] , user_id: [number] }

Response Codes

200 Recipe created

Response Data

{ recipe_id: [number] , recipe_name: [string] , recipe_description: [string] , recipe_ingredients: Ingredient[] }

500 Internal server error

POST /:user_id/getrecipes: This endpoint returns all recipes associated with the user specified by user_id.

POST /getrecipes

Data Required

{ user_id: [number] }

Response Codes

200 Recipes retrieved

Response Data

Recipe[]

A Recipe object is defined as follows:

{ recipe_id: [number] , recipe_name: [string] , recipe_description: [string] , recipe_ingredients: Ingredient[] }

500 Internal server error

POST /deleterecipe: This endpoint deletes the recipe specified by recipe_id.

Data Required

{ recipe_id: [number] }

Response Codes

200 Recipe deleted

Response Data

{ recipe_id: [number] }

500 Internal server error

GET /getAllIngredientsFromList: This endpoint returns all ingredients from all pantries that the user has access to.

Response Codes

200 Ingredients retrieved

Response Data

Ingredient[]
A Ingredient object is defined as follows:

{ ingredient_id: [number] , ingredient_name: [string] , ingredient_quantity: [number] , ingredient_unit: [string] , ingredient_pantry_id: [number] }

500 Internal server error
