const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    //req.user has the payload from the middleware
    // res.json(req.user);

    //using req.user.id from the authorization middleware
    const user = await pool.query(
      "SELECT user_name, user_email FROM users WHERE user_id = $1",
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json({ status: "success", user: user.rows[0] });
  } catch (error) {
    console.error("Dashboard error", error.message);
    res
      .status(500)
      .json({ error: "Server error", message: "Failed to fetch user data" });
  }
});
module.exports = router;
