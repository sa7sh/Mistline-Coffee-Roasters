const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("./db");
const Product = require("./models/Product");

function imageUrl(fileName) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME is missing");
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/${fileName}`;
}

const coffees = [
  {
    name: "Mistline Morning",
    origin: "Chikmagalur",
    roast: "Light",
    tastingNotes: "jasmine, bergamot, cane sugar",
    weight: 250,
    price: 749,
    stock: 18,
    image: imageUrl("mistline-morning.jpg"),
  },
  {
    name: "Baba Budan Lot",
    origin: "Chikmagalur",
    roast: "Medium",
    tastingNotes: "orange peel, cocoa, jaggery",
    weight: 250,
    price: 699,
    stock: 24,
    image: imageUrl("baba-budan-lot.jpg"),
  },
  {
    name: "Ridge Dark",
    origin: "Chikmagalur",
    roast: "Dark",
    tastingNotes: "dark cocoa, cedar, molasses",
    weight: 500,
    price: 1299,
    stock: 0,
    image: imageUrl("ridge-dark.jpg"),
  },
  {
    name: "Kodagu Honey",
    origin: "Coorg",
    roast: "Medium",
    tastingNotes: "honey, red apple, nutmeg",
    weight: 250,
    price: 729,
    stock: 15,
    image: imageUrl("kodagu-honey.jpg"),
  },
  {
    name: "Rain Orchard",
    origin: "Coorg",
    roast: "Light",
    tastingNotes: "white grape, lemon zest, brown sugar",
    weight: 250,
    price: 769,
    stock: 11,
    image: imageUrl("rain-orchard.jpg"),
  },
  {
    name: "Plantation Night",
    origin: "Coorg",
    roast: "Dark",
    tastingNotes: "clove, cocoa nib, burnt caramel",
    weight: 1000,
    price: 2399,
    stock: 6,
    image: imageUrl("plantation-night.jpg"),
  },
  {
    name: "Valley Lot",
    origin: "Araku",
    roast: "Medium",
    tastingNotes: "milk chocolate, almond, dried fig",
    weight: 250,
    price: 689,
    stock: 20,
    image: imageUrl("valley-lot.jpg"),
  },
  {
    name: "Eastern Slope",
    origin: "Araku",
    roast: "Light",
    tastingNotes: "blueberry, black tea, panela",
    weight: 500,
    price: 1349,
    stock: 9,
    image: imageUrl("eastern-slope.jpg"),
  },
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  const created = await Product.insertMany(coffees);
  console.log(`Seeded ${created.length} coffees`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error.message);
  process.exit(1);
});