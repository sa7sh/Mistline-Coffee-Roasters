const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 5000;
const localDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

function allowedOrigin(origin, callback) {
  const configured = process.env.CLIENT_ORIGIN;
  if (!origin) {
    callback(null, true);
    return;
  }
  if (configured) {
    const allowed = configured.split(",").map((value) => value.trim());
    callback(null, allowed.includes(origin));
    return;
  }
  callback(null, localDevOrigin.test(origin));
}

app.use(cors({ origin: allowedOrigin }));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = Number(err.status) || Number(err.statusCode) || 500;
  let message = "Something went wrong";

  if (err.type === "entity.parse.failed") {
    message = "Request body must be valid JSON";
  } else if (status < 500 && typeof err.message === "string" && err.message) {
    message = err.message;
  }

  if (status >= 500) {
    console.error(err.message);
  }

  res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
});

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});