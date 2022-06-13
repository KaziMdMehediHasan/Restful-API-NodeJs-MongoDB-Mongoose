const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/order");
const mongoose = require("mongoose");
const userRoutes = require("./api/routes/user");
// connect the database with mongoose
mongoose
  .connect(
    `mongodb+srv://resftful-api:restful-api@restful-api.fdzsm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((error) => {
    console.error("Something went wrong", error);
  });
// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It works!",
//   });
// });
// mongoosePromise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads')); //making the upload folder publicly available
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// to handle cors error
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,PATCH,GET");
    return res.status(200).json({});
  }
  next();
});
// routes which handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use('/user', userRoutes);

// error handling
app.use((req, res, next) => {
  const error = new Error("Not Found"); //this is the message
  error.status = 404; //this is the status code
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
