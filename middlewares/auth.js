// import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";
// dotenv.config();

// const SECRET_KEY = process.env.SECRET_KEY;

// const auth = (req, res, next)=> {
//    console.log("in....auth...");
//    const token = req.headers.authorization;
  
   
//    console.log("in auth token==>",token);

//     if(!token){
//         res.status(401).json({message : 'Authentication Failed !! Token is not found..'});
//     }

//     try{
//         const decode = jwt.verify(token,SECRET_KEY);
//         console.log("decode=>",decode);

//         next();
//         }catch(error){
//         console.log("Error : ",error);
//         res.status(500).json({message : 'Authentication Failed !! Invalid Token..'});
//     }
// }
// export default auth;


import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const auth = (req, res, next) => {
    console.log("in....auth...");
    const authHeader = req.headers.authorization;
    console.log("in auth authHeader==>", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication Failed !! Token is not found..' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("decoded=>", decoded);
        req.user = decoded; // Optionally attach decoded data to request object
        next();
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: 'Authentication Failed !! Invalid Token..' });
    }
}
export default auth;



