import express, { Express, query, Request, Response } from 'express';
import * as helper from './helper.js';
import cors from 'cors';
import axios, { AxiosError, AxiosResponse } from 'axios';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import {Event, PantryCreated, IngredientCreated } from './event_types';
import fs from 'fs';
import EventBusInterface from '../EventBusInterface';

dotenv.config({ path: '../.env' });

const app: Express = express();
const port: any = process.env.PANTRY_PORT || 4004;


app.use(morgan('dev'));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());


interface Pantry {
    pantry_id: number;
    pantry_name: string;
}

app.post('/events', async (req: Request, res: Response) => {
    const event: Event = req.body;
    if (event.type === 'UserCreated') {
        console.log(event, 'event from /event route');  
        res.redirect(307, '/usercreated');
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
        
        await helper.createUser(user_id, email);
        res.status(200).send({user_id: user_id, email: email});
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error creating the user');
        return;
    }
});



app.get('/getingredients', async (req: Request, res: Response) => {
    const pantry_id_str: any = req.query.pantry_id;
    const pantry_id = pantry_id_str;
    if (!pantry_id) {
        res.status(400).send('Pantry ID is required');
        return;
    }
    try {
        const ingredients = await helper.getAllIngredientsFromPantry(pantry_id);
        res.status(200).send(ingredients);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error getting the ingredients');
        return;
    }
});
interface Ingredient{
    ingredient_id: number,
    ingredient_name: string
}

app.post('/addingredient', async (req: Request, res: Response) => {
    const {pantry_id, ingredient_name, user_id} = req.body;
  
    if (!pantry_id || !ingredient_name || !user_id) {
        res.status(400).send('Pantry ID and ingredient and user ID are required');
        return;
    }
    try {
       
        await helper.addPantryIngredientByName(pantry_id, ingredient_name);
        res.status(200).send('Ingredient added to pantry');
        const PantryContents: Ingredient[] = await helper.getAllIngredientsFromPantry(pantry_id) || []; 
        const url = process.env.NODE_ENV === 'production'
        ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/events'
        : 'http://localhost:' + process.env.EVENTBUS_PORT + '/events';
        const event: PantryCreated = {
            type: 'PantryCreated',
            data: {
                user_id: user_id,
                pantry_id: pantry_id,
                ingredients: PantryContents
            }
        };
        console.log(event, 'event from /addingredient route');
        await axios.post(url, event);


        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error adding the ingredient');
        return;
    }
});

app.post('/deleteingredient', async (req: Request, res: Response) => {
    const {pantry_id, ingredient_id} = req.body;
    if (!ingredient_id) {
        res.status(400).send('Ingredient ID is required');
        return;
    }
    try {
        await helper.deletePantryIngredient(pantry_id, ingredient_id);
        res.status(200).send('Ingredient deleted from pantry');
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).send('There was an error deleting the ingredient');
        return;
    }

});

app.get('/getpantry', async (req: Request, res: Response) => {

    const pantry_id_str: any = req.query.pantry_id;
    const pantry_id = pantry_id_str;
    if (!pantry_id) {
        res.status(400).send('Pantry ID is required');
        return;
    }
    try {
        const pantry = await helper.getPantryById(pantry_id);
        res.status(200).send(pantry);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send('There was an error getting the pantry');
        return;
    }
});



app.get('/:id/getpantries', async (req: Request, res: Response) => {
    try {
        console.log(req.params.id, '-from pantry get');
        const pantries: Pantry[] = await helper.getUserPantries(parseInt(req.params.id)) || [];
        console.log(pantries, 'pantries from server');
        
        res.status(200).send(pantries);
        return;
    } catch (error) {
        res
            .status(500).send('There was an error getting the pantries');
            return;
    }
});


app.post('/:id/pantrycreated', async (req: Request, res: Response) => {
    
    
    try {
        console.log(req.body, '-from pantry post f');
        const {pantry_name } = req.body;
        const user_id = parseInt(req.params.id);

        console.log(user_id, "from server");
        console.log(pantry_name, "from server");
  
        
        const pantry_id = await helper.createPantry(pantry_name, user_id); //returns pantry_id
     
        res.status(200).send(pantry_id);

    } catch (error) {
        console.log(req.body, "this is the req body");
        res
            .status(500)
    }
});

app.post('/:id/pantrydeleted', async (req: Request, res: Response) => {
    try{
        const {pantry_id } = req.body;

        console.log(pantry_id, "from server");
        await helper.deletePantry(pantry_id);
        res.status(200).send("deleted");
    } catch (error) {
        res
            .status(500)
    }

    }
);

app.post('/:id/pantryupdated', async (req: Request, res: Response) => {
    try{
        const {pantry_id, pantry_name } = req.body;

        console.log(pantry_id, "from server");
        await helper.updatePantry(pantry_id, pantry_name);
        res.status(200).send("updated");
    }
    catch (error) {
        res
            .status(500)
    }

    }
);



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
        await new Promise(r=> setTimeout(r,10000))
        try{
        await helper.initializeIngredientsList();
        const ingredients : string[] = await readJSON();
        if (ingredients) {
            console.log(ingredients)
            for (let ingredient of ingredients) {
                 
                const ingr = await helper.insertIntoIngredientList(ingredient);
                //send event to event bus
                
                const url = process.env.NODE_ENV === 'production'
        ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/events'
        : 'http://localhost:' + process.env.EVENTBUS_PORT + '/events';

                const event: IngredientCreated = {
                    type: 'IngredientCreated',
                    data: {
                        ingredient_id: ingr.ingredient_id,
                        ingredient_name: ingr.ingredient_name
            }
            
        }
        
            console.log(event, "ingredient")
        await axios.post(url, event).catch((err: AxiosError) => {
            console.log(err.message);
            console.log("error sending event to event bus");
        })
        
                }}

            
        
    } catch (error) {
        console.log(error);
    }
}



        largeIngredientsList();

interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
}
       
//get all ingredients
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




//get all ingredients from user's ingredient table
app.get('/getallingredients', async (req: Request, res: Response) => {
    try {
      
        const pantry_id = parseInt(req.params.id);
        console.log(pantry_id, "get all ingredients pantry id");
        const ingredients: Ingredient[] = await helper.getAllIngredientsFromPantry(pantry_id) || [];
        res.status(200).send(ingredients);
        return;
    } catch (error) {
        res
            .status(500).send('There was an error getting the ingredients');
            return;
    }
});








app.listen(port, async () => {
    console.log(`Pantry service listening at http://localhost:${port}`);
    const ebif = new EventBusInterface('pantry', port);

    await ebif.register();
    await ebif.publish(['PantryCreated', 'IngredientCreated']);
    await ebif.subscribe(['UserCreated']);
}
);




