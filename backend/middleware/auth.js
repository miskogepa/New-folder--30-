import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Nije prosleđen token." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "tajna");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Nevažeći ili istekao token." });
  }
};

export default auth;
