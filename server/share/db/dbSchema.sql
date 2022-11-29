CREATE TABLE IF NOT EXISTS recipes (
  recipe_id BIGSERIAL PRIMARY KEY,
  recipe_name VARCHAR
);

CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id BIGSERIAL PRIMARY KEY,
  ingredient_name VARCHAR
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id BIGINT NOT NULL,
  ingredient_id BIGINT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients
);