const Place = require("../models/place");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const place = await Place.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  place.reviews.push(review);
  await review.save();
  await place.save();
  req.flash("success", "Review posted!");
  res.redirect(`/places/${place._id}`);
};

module.exports.deleteReviews = async (req, res) => {
  const { id, reviewId } = req.params;
  await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully feleted review!");
  res.redirect(`/places/${id}`);
};
