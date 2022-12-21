Pantry Service
Author

Alex Bowman (bowmana on github)

Description

The pantry service is used to manage pantries, ingredients, and send all pantry data to recipes. It allows users to create pantries, add ingredients to pantries, and create and save recipes that use ingredients from the pantries.

How to Use
To run this service from scratch (not using Docker), type npm start.

To run this service from scratch (using Docker Compose), compile the TypeScript by typing tsc into the console and then after compilation type

docker compose -f "docker-compose.yml" up -d --build pantry

Interservice Communication
The pantry service communicates with the event bus service to publish events when a pantry or ingredient is created. It also uses the event bus to subscribe to the user created event to make unique pantries to that user. The published pantry created event is used by the recipe service to get the pantry data. The published ingredient created event is used by the share service to get the ingredient data.

Endpoints

POST /pantrycreated

Data Required

{
pantry_name: [string]
user_id: [number]
}

Response Codes

200 Pantry created

Response Data

{
pantry_id: [number],
pantry_name: [string]
}

500 Internal server error

POST /pantryupdated

Data Required

{
pantry_id: [number],
pantry_name: [string]
}

Response Codes

200 Pantry updated

Response Data

{
pantry_id: [number],
pantry_name: [string]
}

500 Internal server error

POST /pantrydeleted

Data Required

{
pantry_id: [number]
}

Response Codes

200 Pantry deleted

Response Data

{
pantry_id: [number]
}

500 Internal server error

GET /getpantries

Data Required

{
user_id: [number]
}

Response Data

{
pantry_id: [number],
pantry_name: [string]
}

Response Codes

200 Pantries retrieved from user

Response Data

{
user_id: [number],
pantries: [
{
pantry_id: [number],
pantry_name: [string],
}
...
]
}

500 Internal server error

POST /addingredient

Data Required

{
pantry_id: [number],
ingredient_name: [string]
}

Response Codes

200 Ingredient added to pantry

Response Data

{
pantry_id: [number],
ingredient_id: [number],
ingredient_name: [string]
}

500 Internal server error

POST /deleteingredient

Data Required

{
pantry_id: [number],
ingredient_id: [number]
}

Response Codes

200 Ingredient deleted from pantry

Response Data

{
pantry_id: [number],
ingredient_id: [number]
}

500 Internal server error

GET /getallingredients

Data Required

{
pantry_id: [number]
}

Response Codes

200 Ingredients retrieved from pantry

Response Data

{
pantry_id: [number],
ingredients: [
{
ingredient_id: [number],
ingredient_name: [string],
}
...
]
}

500 Internal server error

GET /getAllIngredientsFromList

Data Required N/A

Response Codes

200 Ingredients retrieved from pantry

Response Data

{
ingredients: [
{
ingredient_id: [number],
ingredient_name: [string],
}
...
]
}

500 Internal server error
