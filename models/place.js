const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const PlaceSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    price: Number,
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ]
  },
  opts
);

PlaceSchema.virtual("properties.popUpMarkup").get(function () {
  return `
     <strong><a href="/places/${this._id}">${this.title}</a></strong>
     <p>${this.description.substring(0, 30)}...</p>
     `;
});

PlaceSchema.post("findOneAndDelete", async function (doc) {
  //delete all reviews when place is deleted
  if (doc) {
    await Review.remove({
      _id: {
        $in: doc.reviews
      }
    });
  }
});

const Place = mongoose.model("Place", PlaceSchema);

module.exports = Place;
