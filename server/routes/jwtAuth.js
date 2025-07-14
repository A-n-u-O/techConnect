const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//registering
router.post("/register", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body to get (name, email, password)
    const { name, email, password } = req.body;
    console.log("Register request body:", req.body);

    //2. check if user exists(if user exists then throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    console.log("user found:", user.rows);

    if (user.rowCount !== 0) {
      //if the user exists
      return res.status(401).json("user already exists"); //the person is unauthenticated, 403- unauthorized
    }

    //3. else bcrypt the user password
    const saltRounds = 10; //how strong the hash is
    const salt = await bcrypt.genSalt(saltRounds); //salt - random data for each password to make it more secure
    //start encrypting
    const bcryptPassword = await bcrypt.hash(password, salt); //hashes the plain password with salt
    console.log("Hashed password:", bcryptPassword);

    //4. Enter the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );
    // res.json(newUser.rows);
    console.log("new user inserted", newUser.rows);

    //5. Generating our jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.status(200).json({
      status: "success",
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser.rows[0].user_id,
        name: newUser.rows[0].user_name,
        email: newUser.rows[0].user_email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    //a lot more bcrypt

    // 1. destructure the request.body(req)
    const { email, password } = req.body;
    console.log("Login Attempt for:", email);

    // 2. check if user does exist(if not, throw error)
    const user = await pool.query(
      "SELECT * FROM users WHERE LOWER(user_email) = LOWER($1)",
      [email]
    );

    if (user.rowCount === 0) {
      console.log("user not found for email:", email);
      return res.status(401).json({
        error: "Invalid Credentials",
        message: "Email or Password is incorrect",
      }); //unauthenticated
    }

    // 3. check if incoming password is the same as database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      console.log("Invalid password for email:", email);
      return res.status(401).json({
        error: "Invalid Credentials",
        message: "Email or Password is incorrect",
      });
    }

    console.log(validPassword);

    // 4. if password is correct, give them the jwt token
    const token = jwtGenerator(user.rows[0].user_id);
    console.log("Generated token for user:", user.rows[0].user_id);
    res.json({
      status: "success",
      message: "Login successful",
      token: token,
      user: {
        id: user.rows[0].user_id,
        name: user.rows[0].user_name,
        email: user.rows[0].user_email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    //Return minimal user info needed by client
    res.json({ isVerified: true, user: { id: req.user, name: req.user.name } });
  } catch (error) {
    console.error("Verification error:", error.message);
    res.status(500).json({
      error: "Verification failed",
      message: "Could not verify authentication status",
    });
  }
});
module.exports = router;
