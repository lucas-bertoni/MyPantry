interface Event {
  type: string;
  data: any
};

interface UserCreated extends Event {
  type: 'UserCreated';
  data: {
    user_id: number;
    email: string;
  };
};

interface LoginSuccess extends Event {
  type: 'LoginSuccess';
  data: {
    user_id: number;
    email: string;
  };
};

interface IngredientCreated extends Event {
  type: 'IngredientCreated';
  data: {
    ingredient_id: number;
    ingredient_name: string;
  };
};

interface RecipeCreated extends Event {
  type: 'RecipeCreated';
  data: {
    recipe_id: number;
    recipe_name: string;
    ingredients_list: number[];
  };
};

interface PantryCreated extends Event {
  type: 'PantryCreated';
  data: {
    user_id: number;
    pantry_id: number;
  }
};

interface ShareRecipe extends Event {
  type: 'ShareRecipe',
  data: {
    recipe_id: number;
  }
};

export {
  Event,
  UserCreated,
  LoginSuccess,
  IngredientCreated,
  RecipeCreated,
  PantryCreated,
  ShareRecipe
};