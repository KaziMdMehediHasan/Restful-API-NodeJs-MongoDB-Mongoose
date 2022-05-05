const express = require("express");
const router = express.Router();
const morgan = require("morgan");

// get route for data fetchjng
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders were fetched",
  });
});

// post route for creating
router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: "Orders were Created",
    order: order,
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
