import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const auth = (req, res, next) => {

  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication Failed !! Token is not found.." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded; 
    next();
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Authentication Failed !! Invalid Token.." });
  }
};
export default auth;
