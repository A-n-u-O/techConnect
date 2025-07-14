function validInfo(req, res, next) {
  const { email, name, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (!email || !name || !password) {
      return res.status(401).json({ error: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ error: "invalid Email" });
    }
  } else if (req.path === "/login") {
    if (!email || !password) {
      return res.status(401).json({ error: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ error: "invalid Email" });
    }
  }
  console.log("validInfo middleware hit on", req.path);
  console.log("Received:", { name, email, password });

  next();
}
module.exports = validInfo;
