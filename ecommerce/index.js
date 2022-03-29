const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { orderBy } = require("lodash");

const { randomDelayMiddleware, randomFailureMiddleware } = require("./helpers");
const products = require("./products");
const { OrderModel } = require("./order.model");

const isError = (source) => source instanceof Error;

var jsonParser = bodyParser.json();

const app = express();

app.use(jsonParser);
app.use(cors());

app.use("/images", express.static("images"));

app.get("/", (req, res) => {
  return res.send("Ecommerce API!");
});

app.get(
  "/api/products",
  randomDelayMiddleware,
  randomFailureMiddleware,
  (req, res) => {
    const pageSize = 5;
    let results = [...products];
    let totalCount = results.length;

    const {
      page = 1,
      category = "all",
      minPrice = 0,
      maxPrice = Infinity,
      order = "asc",
    } = req.query;

    if (category !== "all") {
      results = results.filter((product) => product.type === category);
      totalCount = results.length;
    }

    results = results.filter(
      (product) =>
        product.price >= Number(minPrice) && product.price <= Number(maxPrice)
    );

    results = orderBy(results, ["price"], [order]);

    totalCount = results.length;

    if (page) {
      const startAt = (Number(page) - 1) * pageSize;
      const endAt = startAt + pageSize;

      results = results.slice(startAt, endAt);
    }

    return res.send({
      total: totalCount,
      pageSize,
      page,
      data: results,
    });
  }
);

app.post(
  "/api/orders",
  randomDelayMiddleware,
  randomFailureMiddleware,
  (req, res) => {
    const result = OrderModel.create(req.body);

    if (isError(result)) {
      return res.status(400).send(result);
    }

    return res.status(201).send(result);
  }
);

app.get(
  "/api/orders",
  randomDelayMiddleware,
  randomFailureMiddleware,
  (req, res) => {
    return res.send(OrderModel.getAll());
  }
);

app.get(
  "/api/orders/:orderId",
  randomDelayMiddleware,
  randomFailureMiddleware,
  (req, res) => {
    const orderId = req.params["orderId"];

    const order = OrderModel.getDetails(orderId);

    if (isError(order)) {
      return res.status(404).send(order);
    }

    return res.send(order);
  }
);

app.listen(8080, () =>
  console.log(`Ecommerce API listening on http://localhost:8080`)
);
