const express = require("express");
const cors = require("cors");
const app = express();

//middleware
app.use(cors());
app.use(express.json()); //for parsing incoming json in req.body

//ROUTES//


//Auth related routes
//register and login routes
app.use("/auth", require("./routes/jwtAuth"));
//dashboard route
app.use("/auth/dashboard", require("./routes/dashboard"));

//Other routes
//route to manage content on your blog
app.use("/content", require("./routes/contentActions"));

app.listen(5000, () => {
  console.log("server started on port 5000");
});
