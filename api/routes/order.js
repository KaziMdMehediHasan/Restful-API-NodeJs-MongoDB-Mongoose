const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
// get route for data fetchjng
router.get("/", (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:5000/orders/${doc._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// post route for creating
router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({ result, message: "Order Created Succesfully!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// get by id
router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Orders were fetched",
    orderId: req.params.orderId,
  });
});

// delete by ID
router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Orders were Deleted",
    orderId: req.params.orderId,
  });
});

module.exports = router;
