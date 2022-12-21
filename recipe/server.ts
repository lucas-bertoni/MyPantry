import express, { Express, query, Request, Response } from 'express';
import * as helper from './helper.js';
import cors from 'cors';
import axios, { AxiosError, AxiosResponse } from 'axios';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import {Event, PantryCreated, IngredientCreated, RecipeCreated } from './event_types';
import fs from 'fs';
import EventBusInterface from '../EventBusInterface';
import { Interface } from 'readline';

dotenv.config({ path: '../.env' });

const app: Express = express();
const port: any = process.env.RECIPE_PORT || 4005;



app.use(morgan('dev'));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());

app.post('/events', async (req: Request, res: Response) => {
    const event: Event = req.body;
    if (event.type === 'UserCreated') {
        console.log(event, 'event from /event route');  
        res.redirect(307, '/usercreated');
        return;
    }
    if (event.type === 'PantryCreated') {
        console.log(event, 'event from /event route');  
        res.redirect(307, '/pantrycreated');
        return;
    }
    res.send(null);
});

app.post('/usercreated', async (req: Request, res: Response) => {
    const event: Event = req.body;
    console.log(event, 'event is here on the usercreated route');
    const {user_id, email} = event.data;
    if(!user_id || !email) {
        res.status(400).send('user_id or email is missing');
        return;
    }
    try{
        console.log('trying to create user', user_id, email);
        const user = await helper.createUser(user_id, email);
        console.log(user, 'user is here');
        res.status(200).send(user);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error creating the user');
        return;
    }
});

interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
}


app.post('/pantrycreated', async (req: Request, res: Response) => {
    const event: PantryCreated = req.body;
    console.log(event, 'event from pantrycreated route');


    const ingredients = event.data.ingredients as Ingredient[];
    const user_id: number = event.data.user_id;
    console.log(ingredients, 'ingredients are here');
    console.log(user_id, 'user id is here on pantrycreated route');
    

  
    if(!ingredients || !user_id) {
        res.status(400).send('ingredients is missing');
        return;
    }

    try{
        for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i];
            
            const ingredient_id : number = ingredient.ingredient_id;
            const ingredient_name : string = ingredient.ingredient_name;

            
            console.log(ingredient_id, 'ingredient id is here');
            if(!ingredient_id || !ingredient_name) {
                res.status(400).send('ingredient_id or ingredient_name is missing');
                return;
            }
            const ingredientAdded = await helper.addToLargeIngredients(ingredient_id, ingredient_name, user_id);
            console.log(ingredientAdded, 'ingredient added');
        }
        res.status(200).send('ingredients added');
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).send('There was an error adding the ingredients');
        return;
    }
});


// getallingredientsfrompantries
app.get('/getallingredientsfrompantries', async (req: Request, res: Response) => {

    const user_id_str: any = req.query.user_id;
    const user_id = parseInt(user_id_str);
    console.log(user_id, 'user id is here');
    try{
        const ingredients = await helper.getAllIngredientsFromLargeIngredients(user_id);
        console.log(ingredients, 'ingredients are here');
        res.status(200).send(ingredients);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error getting the ingredients');
        return;
    }
});




app.post('/:user_id/addrecipe', async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id);
    const {recipe_name, recipe_description, recipe_ingredients} : {recipe_name: string, recipe_description: string, recipe_ingredients: string[]} = req.body;
    if(!recipe_name || !recipe_description || !recipe_ingredients) {
        res.status(400).send('recipe_name, recipe_description, or recipe_ingredients is missing');
        return;
    }
    try{


        await helper.userExists(user_id);
        console.log(user_id, recipe_name, recipe_description, recipe_ingredients, 'recipe info')
        const recipe = await helper.createRecipe(user_id, recipe_name, recipe_description, recipe_ingredients) 
        // const ingredients_list = recipe.recipe_ingredients as ingredients_list[];
        console.log(recipe, 'recipe is here');
        //recipe_ingredients: [ { ingredient_id: 8, ingredient_name: 'fish' } ]
        
        if(recipe){
        res.status(200).send(recipe);
        const recipe_ids = recipe.recipe_ingredients.map((ingredient: any) => ingredient.ingredient_id) as number[];
         
        const url = process.env.NODE_ENV === 'production'
        ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/events'
        : 'http://localhost:' + process.env.EVENTBUS_PORT + '/events';
        const event: RecipeCreated = {
            type: 'RecipeCreated',
            data: {
                recipe_id: recipe.recipe_id,
                recipe_name: recipe.recipe_name,
                recipe_description: recipe.recipe_description,
                ingredients_list: recipe_ids,
            }
        }
        console.log(event, 'event is here');
        await axios.post(url, event);
       
        return;
    }

    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error adding the recipe');
        return;
    }
});




app.get('/:user_id/getrecipes', async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id);
    try{
        const recipes = await helper.getRecipes(user_id);
        res.status(200).send(recipes);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error getting the recipes');
        return;
    }
});


app.delete('/:user_id/deleterecipe', async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id);
    const {recipe_id} = req.body;
    if(!recipe_id) {
        res.status(400).send('recipe_id is missing');
        return;
    }
    try{
        const recipe = await helper.deleteRecipe(user_id, recipe_id);
        res.status(200).send(recipe);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error deleting the recipe');
        return;
    }
});

//-----------------------------------------------------------------------------------
 
async function readJSON(filename = "./foodDB.json") {

    try {
        // Open the file in read-only mode
        const fd = await fs.promises.open(filename, "r");

        // Read the file's contents
        const data = await fs.promises
            .readFile(fd, "utf-8")
            .then((data) => JSON.parse(data));

        // Close the file
        await fd.close();

        //if result is undefined, return empty array
        return data.food.foodNames || [];
    } catch (error) {
        console.log(error);
    }
}


    async function largeIngredientsList() {
        try{
        await helper.initializeIngredientsList();
        const ingredients : string[] = await readJSON();
        if (ingredients) {
            for (let ingredient of ingredients) {
                 await helper.insertIntoIngredientList(ingredient);
        //         const ingr = await helper.insertIntoIngredientList(ingredient);
        //         //send event to event bus
        //         const url = process.env.NODE_ENV === 'production' ? 'http://eventbus:4002/events' : 'http://localhost:4002/events';
        //         const event: IngredientCreated = {
        //             type: 'IngredientCreated',
        //             data: {
        //                 ingredient_id: ingr.ingredient_id,
        //                 ingredient_name: ingr.ingredient_name
        //     }
        // }
            
        // await axios.post(url, event).catch((err: AxiosError) => {
        //     console.log(err.message);
        //     console.log("error sending event to event bus");
        // });
        // }
            }}
    } catch (error) {
        console.log(error);
        console.log("error in largeIngredientsList");
    }
}


        largeIngredientsList();
//-----------------------------------------------------------------------------------------


app.get('/getAllIngredientsFromList', async (req: Request, res: Response) => {
    try {
        const ingredients: Ingredient[] = await helper.getAllIngredientsFromList() || [];
        res.status(200).send(ingredients);
        return;
    } catch (error) {
        res
            .status(500).send('There was an error getting the ingredients');
            return;
    }
});

app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
    const ebif = new EventBusInterface('recipe', port);

    await ebif.register();
    await ebif.publish(['RecipeCreated']);
    await ebif.subscribe(['UserCreated', 'PantryCreated']);
});

