import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "somethingsupersecert", // to read contents of .env and use it in this var, also we use JWT_SECRET to Encypt user's data in token string to secure our req
    { expiresIn: "30d" }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization; // i am going to get authorization field from headers of this req
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsupersecert",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Inavalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    ); // verify decrypt the token for us and 3rd param of verify is a callback fun, also decode contains data inside token
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
// this is new func to authenticate only admin users, we use this to protect our apis for admins like updating a product or managing an order
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};
