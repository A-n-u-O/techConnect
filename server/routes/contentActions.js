const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");
const authorization = require("../middleware/authorization");

//to create content on the blog
router.post("/createContent", authorization, async (req, res) => {
  try {
    const user_id = req.user; //current user id
    const { title, description, body } = req.body;
    console.log("create content", req.body);

    //validating inputs
    if (!title || !description || !body) {
      return res.status(400).json({ error: "fill all input fields" });
    }

    const newPost = await pool.query(
      "INSERT INTO posts (post_title, post_description, post_body, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, body, user_id]
    );

    res.json(newPost.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

//to get all posts by the user
router.get("/", authorization, async (req, res) => {
  //authorize was add to protect the route since it returns posts only for the loggged in user
  try {
    const user_id = req.user;
    const userPosts = await pool.query(
      "SELECT * FROM posts wHERE user_id = $1",
      [user_id]
    );
    res.json(userPosts.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "server error" });
  }
});

//to get a post by the user maybe by search
router.get("/content/:id", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const post_id = req.params.id;

    const singlePost = await pool.query(
      "SELECT * FROM posts WHERE post_id = $1 AND user_id = $2",
      [post_id, user_id]
    );

    if (singlePost.rowCount === 0) {
      return res.status(404).json({ error: "Post Not Found" });
    }

    res.json(singlePost.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "server error" });
  }
});

//edit a post
router.put("/content/edit", authorization, async (req, res) => {
  const { id } = req.params.id;
  const { title } = req.params.title;
  const { description } = req.params.descriptions;
  const { body } = req.params.body;
  const editPost = await pool.query(
    "UPDATE posts SET post_title = $1, post_description = $2, post_body = $3 WHERE post_id = $4",
    [title, description, body, id]
  );

  res.json("post updated successfully");
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

//delete a post
router.delete("/content/:id", authorization, async (req, res) => {
  const { id } = req.params.id;
  const deletePost = await pool.query("DELETE FROM posts WHERE post_id = $1", [
    id,
  ]);

  res.json("post deleted successfully");
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "server error occured" });
  }
});
module.exports = router;
