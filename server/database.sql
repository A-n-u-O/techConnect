CREATE DATABASE blogplatform

--set extension
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

--insert fake users
INSERT INTO users (user_name, user_email, user_password) VALUES('anu','anuvictor2005@gmail.com','anu_password123');

CREATE TABLE posts(
    post_id SERIAL PRIMARY KEY,
    post_title VARCHAR(255) NOT NULL,
    post_description VARCHAR(255) NOT NULL,
    post_body VARCHAR(1000) NOT NULL,
    post_dateAndTime TIMESTAMP NOT NULL,
    user_id uuid REFERENCES users(user_id)
);