CREATE TABLE
    IF NOT EXISTS users (
        user_id BIGSERIAL PRIMARY KEy,
        user_name VARCHAR
    );

CREATE TABLE
    IF NOT EXISTS pantries (
        pantry_id BIGSERIAL PRIMARY KEY,
        pantry_name VARCHAR
    );

CREATE TABLE
    IF NOT EXISTS ingredients (
        ingredient_id BIGSERIAL PRIMARY KEY,
        ingredient_name VARCHAR
    );

CREATE TABLE
    IF NOT EXISTS pantry_ingredients (
        pantry_id BIGINT NOT NULL,
        ingredient_id BIGINT NOT NULL,
        FOREIGN KEY (pantry_id) REFERENCES pantries,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients
    );

CREATE TABLE
    IF NOT EXISTS user_pantries (
        user_id BIGINT NOT NULL,
        pantry_id BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users,
        FOREIGN KEY (pantry_id) REFERENCES pantries
    );