CREATE TABLE IF NOT EXISTS users (
  user_id BIGSERIAL PRIMARY KEY,
  email VARCHAR,
  password VARCHAR,
  role INT DEFAULT 0,
  token VARCHAR
);

CREATE TABLE IF NOT EXISTS pantries (
  pantry_id BIGSERIAL PRIMARY KEY,
  pantry_name VARCHAR
);

CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id BIGSERIAL PRIMARY KEY,
  ingredient_name VARCHAR
);

CREATE TABLE IF NOT EXISTS pantry_ingredients (
  pantry_id BIGINT NOT NULL,
  ingredient_id BIGINT NOT NULL,
  FOREIGN KEY (pantry_id) REFERENCES pantries,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients
);

CREATE TABLE IF NOT EXISTS user_pantries (
  user_id BIGINT NOT NULL,
  pantry_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users,
  FOREIGN KEY (pantry_id) REFERENCES pantries
);

CREATE TABLE IF NOT EXISTS recipes (
  recipe_id BIGSERIAL PRIMARY KEY,
  recipe_name VARCHAR
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id BIGINT NOT NULL,
  ingredient_id BIGINT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients
);

CREATE TABLE IF NOT EXISTS user_recipes (
  user_id BIGINT NOT NULL,
  recipe_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users,
  FOREIGN KEY (recipe_id) REFERENCES recipes
);

-- Example query to get the list of pantry names and ids for a specific user (in this case the user with id 12345):
SELECT
  P.pantry_id,
  P.pantry_name
FROM
  users U,
  pantries P,
  user_pantries UP
WHERE
  U.user_id = UP.user_id AND
  P.pantry_id = UP.pantry_id AND
  U.user_id = 12345
;

-- Example query to get the list of ingredient names and ids in a specific pantry (in this case the pantry with id 12345):
SELECT
  I.ingredient_id,
  I.ingredient_name
FROM
  pantries P,
  ingredients I,
  pantry_ingredients PI
WHERE
  P.pantry_id = PI.pantry_id AND
  I.ingredient_id = PI.ingredient_id AND
  P.pantry_id = 12345
;

-- Example query to get all of a user's pantries and all of the ingredients inside of them at once (not recommended):
SELECT
  P.pantry_id,
  P.pantry_name,
  I.ingredient_id,
  I.ingredient_name
FROM
  users U,
  pantries P,
  ingredients I,
  user_pantries UP,
  pantry_ingredients PI
WHERE
  U.user_id = UP.user_id AND
  P.pantry_id = UP.pantry_id AND
  I.ingredient_id = PI.ingredient_id AND
  P.pantry_id = PI.pantry_id AND
  U.user_id = 12345
GROUP BY
  P.pantry_id, P.pantry_name, I.ingredient_id
ORDER BY
  P.pantry_id
;
