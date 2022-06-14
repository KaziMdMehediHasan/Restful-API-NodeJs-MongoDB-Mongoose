const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");
const OrdersController = require('../controllers/order');
// get route for data fetchjng : before adding controllers
// router.get("/", checkAuth, (req, res, next) => {
//   Order.find()
//     .select("_id product quantity")
//     .populate('product', 'name')
//     .exec()
//     .then((docs) => {
//       res.status(200).json({
//         count: docs.length,
//         orders: docs.map((doc) => {
//           return {
//             product: doc.product,
//             quantity: doc.quantity,
//             _id: doc._id,
//             request: {
//               type: "GET",
//               url: `http://localhost:5000/orders/${doc._id}`,
//             },
//           };
//         }),
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

// post route for creating : before adding controllers
// router.post("/", checkAuth, (req, res, next) => {
//   Product.findById(req.body.productId)
//     .then((product) => {
//       if (!product) {
//         return res.status(404).json({
//           message: "Product not found",
//         });
//       }
//       const order = new Order({
//         _id: mongoose.Types.ObjectId(),
//         quantity: req.body.quantity,
//         product: req.body.productId,
//       });
//       return order.save();
//     })
//     .then((result) => {
//       console.log(result);
//       res.status(201).json({ result, message: "Order Created Succesfully!" });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

// get by id : before creating controllers
// router.get("/:orderId", checkAuth, (req, res, next) => {
//   Order.findById(req.params.orderId)
//     .populate('product') //this function must be written before exec
//     .exec()
//     .then(order => {
//       if (!order) {
//         return res.status(404).json({
//           message: "Order Not Found"
//         });
//       }
//       res.status(200).json({
//         order: order,
//         request: {
//           type: 'GET',
//           url: 'http://localhost:5000/orders'
//         }
//       })
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     })
//   // res.status(200).json({
//   //   message: "Orders were fetched",
//   //   orderId: req.params.orderId,
//   // });
// });

// delete by ID : before adding controllers
// router.delete("/:orderId", checkAuth, (req, res, next) => {
//   Order.remove({ _id: req.params.orderId }).exec().then(result => {
//     res.status(200).json({
//       message: 'Order Deleted',
//       request: {
//         type: 'POST',
//         url: 'http://localhost:5000/orders',
//         body: { productId: 'ID', quantity: 'Number' }
//       }
//     })
//   }).catch((err) => {
//     res.status(500).json({ error: err });
//   })
//   // res.status(200).json({
//   //   message: "Orders were Deleted",
//   //   orderId: req.params.orderId,
//   // });
// });

// Handle incoming GET requests to orders
router.get('/', checkAuth, OrdersController.orders_ge_all);
router.post('/', checkAuth, OrdersController.orders_create_order);
router.get('/:orderId', checkAuth, OrdersController.orders_get_order_by_id);
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);
module.exports = router;
