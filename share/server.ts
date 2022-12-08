// All written by Lucas Bertoni

interface RecipePart {
  recipe_name: string;
  ingredient_name: string;
}

interface Recipe extends Array<RecipePart>{};

interface FormattedRecipe {
  recipe_name: string;
  ingredients_list: string[];
}

import express, { Express, Request, Response } from 'express';
import * as helper from './helper.js';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { Event, ShareRecipe } from './event_types';

dotenv.config({ path: '../.env' });

const app: Express = express();
const port: any = process.env.SHARE_PORT || 4003;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());


app.post('/events', async (req: Request, res: Response) => {
  const event: Event = req.body;

  // IngredientCreated event type
  if (event.type === 'IngredientCreated') {
    res.redirect('/ingredientcreated');
    return;
  }

  // RecipeCreated event type
  if (event.type === 'RecipeCreated') {
    res.redirect('/recipecreated');
    return;
  }

  // Useless event type
  res.send(null);
});


app.post('/ingredientcreated', async (req: Request, res: Response) => {
  const event: Event = req.body;

  const { ingredient_id, ingredient_name } = event.data;

  if (!ingredient_id || !ingredient_name) {
    res.status(400).send('Ingredient ID and ingredient name required');
    return;
  }

  try {
    const ingredient = await helper.addIngredient(ingredient_id, ingredient_name);
    res.status(201).send(ingredient);
    return;
  } catch (error) {
    res.status(500).send('Ingredient couldn\'t be added to share service');
    return;
  }
});


app.post('/recipecreated', async (req: Request, res: Response) => {
  const event: Event = req.body;

  const { recipe_id, recipe_name, ingredients_list } = event.data;

  if (!recipe_id || !recipe_name || !ingredients_list) {
    res.status(400).send('Recipe ID, name, and ingredients list required');
    return;
  }

  try {
    const recipe = await helper.addRecipe(recipe_id, recipe_name, ingredients_list);
    res.status(201).send(recipe);
    return;
  } catch (error) {
    res.status(500).send('Recipe couldn\'t be added to share service');
    return;
  }
});


app.get('/getrecipe', async (req: Request, res: Response) => {
  const recipe_id_str: any = req.query.recipe_id;
  const recipe_id = parseInt(recipe_id_str);

  if (!recipe_id || recipe_id === NaN) {
    res.status(400).send('Recipe ID required');
    return;
  }

  try {
    const recipe: Recipe | false | undefined = await helper.getRecipe(recipe_id);

    if (!recipe) {
      res.status(401).send('Recipe not found');
      return;
    }

    const formattedRecipe: FormattedRecipe = {
      recipe_name: recipe[0].recipe_name,
      ingredients_list: []
    }

    recipe.forEach( (recipe_part: RecipePart) => {
      formattedRecipe.ingredients_list.push(recipe_part.ingredient_name);
    });

    const url = process.env.NODE_ENV === 'production'
      ? 'http://eventbus:4000/events'
      : 'http://localhost:4000/events';

    const event: ShareRecipe = {
      type: 'ShareRecipe',
      data: {
        recipe_id: recipe_id
      }
    }

    await axios.post(url, event)
      .catch( (axiosError: AxiosError) => {
        console.log('There was an error logging the event');
        console.log(axiosError);
      });

    res.status(200).send(formattedRecipe);
  } catch (error) {
    res.status(500).send('There was an error getting the recipe');
    return;
  }
});


app.listen(port, () => {
  console.log(`Share listening on ${port}`);
})