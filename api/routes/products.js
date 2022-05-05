const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// import the product model from models folder
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .exec() //it makes a true promise
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  // const product = {
  //   name: req.body.name,
  //   price: req.body.price,
  // };
  // product will be created as per the model that is declared in the model. We use the OOP principle here to create a new product
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: err });
    });
});

// get product by id
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id) //mongoose method
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provide Id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// update route
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  console.log(req.body);
  //  by default body is coming as a json object
  const updateOps = {};
  // by receiving the body as an object we run this loop
  // for (const key in req.body) {
  //   updateOps[key] = req.body[key];
  // }

  // we are expecting req.body to be an array. And ops will be an object inside that with value and propName as key value pair

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  console.log(updateOps);
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        result,
        message: "Updated Product!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// delete route using mongoose
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec() //means true promise
    .then((result) => {
      res.status(200).json({ result, message: "Product deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
