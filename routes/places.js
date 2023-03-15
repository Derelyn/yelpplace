const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validatePlace } = require("../middleware");
const places = require("../controllers/places.js");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router.route("/").get(catchAsync(places.index)).post(isLoggedIn, upload.array("image"), catchAsync(places.createPlace));

router.get("/new", isLoggedIn, places.renderNewForm);

router.route("/:id").get(catchAsync(places.showPlace)).put(isLoggedIn, isAuthor, upload.array("image"), catchAsync(places.updatePlace)).delete(isLoggedIn, catchAsync(places.deletePlace));

router.get("/:id/edit", isLoggedIn, isAuthor, validatePlace, catchAsync(places.renderEditForm));

module.exports = router;
