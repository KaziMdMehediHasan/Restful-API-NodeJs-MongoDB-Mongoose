const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// import the product model from models folder
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

/*---------------------for uploading files code starts from here------------------------*/
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(__dirname + '/uploads/'));
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    // After new Date().toISOString() add replace() to change ":" to an accepted character.
    // Windows OS doesn't accept files with a ":"
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {

    cb(null, true);
  } else {

    cb(new Error('Only image files are allowed!'), false);
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 //initially calculated in bytes
  },
  fileFilter: fileFilter
});

/*--------------------------- for uploading files code ends here-----------------------------*/


router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage") //determining which data that will be sent as a response.
    .exec() //it makes a true promise
    .then((docs) => {
      // console.log(docs);
      const response = {
        count: docs.length,
        // sending response with metadata
        products: docs.map((doc) => {
          //this array will be used as metadata
          return {
            name: doc.name,
            price: doc.price,
            _id: doc.id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: `http://localhost:5000/products/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", checkAuth, upload.single('productImage'), (req, res, next) => {
  // const product = {
  //   name: req.body.name,
  //   price: req.body.price,
  // };
  // product will be created as per the model that is declared in the model. We use the OOP principle here to create a new product
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created Product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,

          request: {
            type: "GET",
            url: `http://localhost:5000/products/${result._id}`,
          },
        },
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
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: `http://localhost:5000/products`,
          },
        });
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
router.patch("/:productId", checkAuth, (req, res, next) => {
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
        message: "Updated Product!",
        request: {
          type: "GET",
          url: `http://localhost:5000/products/${id}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// delete route using mongoose
router.delete("/:productId", checkAuth, (req, res, next) => {
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
