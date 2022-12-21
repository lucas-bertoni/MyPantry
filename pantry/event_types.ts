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
  interface Ingredient{
    ingredient_id: number;
    ingredient_name: string;
  }
  interface PantryCreated extends Event {
    type: 'PantryCreated';
    data: {
      user_id: number;
      pantry_id: number;
      ingredients: Ingredient[];
    }
  };
  
  export {
    Event,
    UserCreated,
    LoginSuccess,
    IngredientCreated,
    RecipeCreated,
    PantryCreated
  };