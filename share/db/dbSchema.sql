-- Use BIGINT instead of BIGSERIAL because the recipe_id's and ingredient_id's get determined by their respective services

CREATE TABLE IF NOT EXISTS recipes (
  recipe_id BIGINT PRIMARY KEY,
  recipe_name VARCHAR
);

CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id BIGINT PRIMARY KEY,
  ingredient_name VARCHAR
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id BIGINT NOT NULL,
  ingredient_id BIGINT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients
);