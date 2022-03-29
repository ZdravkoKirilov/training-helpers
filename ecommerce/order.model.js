const { z } = require("zod");
const { v4: uuid } = require("uuid");
const { isNumber } = require("lodash");

const products = require("./products");

const ErrorTypes = {
  ParsingError: "ParsingError",
  OrderNotFound: "OrderNotFound",
  ProductNotFound: "ProductNotFound",
};

const parser = z.object({
  id: z.string().uuid(),
  orderDate: z.date(),
  products: z
    .array(
      z.number().refine((productId) => {
        return !!products.find((elem) => elem.id === productId);
      }, ErrorTypes.ProductNotFound)
    )
    .min(1),
  total: z.number(),
  currency: z.literal("BGN"),
});

let orders = [];

class OrderError extends Error {
  constructor(message, errors) {
    super();
    this.name = "OrderError";
    this.message = message;
    this.errors = errors;
  }
}

const OrderModel = {
  create: (source) => {
    source = source || {};
    const orderProducts = source.products || [];

    const total = orderProducts.reduce((acc, productId) => {
      const item = products.find((elem) => elem.id === productId);

      if (item && isNumber(item.price)) {
        acc += item.price;
      }

      return acc;
    }, 0);

    const parsed = parser.safeParse({
      orderDate: new Date(),
      currency: "BGN",
      id: uuid(),
      total,
      products: orderProducts,
    });

    if (parsed.success) {
      orders.push(parsed.data);
      return parsed.data;
    }

    return new OrderError(
      ErrorTypes.ParsingError,
      parsed.error.flatten().fieldErrors
    );
  },

  getDetails(id) {
    const order = orders.find((elem) => elem.id === id);

    if (!order) {
      return new OrderError(ErrorTypes.OrderNotFound);
    }

    return {
      ...order,
      products: products.filter((elem) => order.products.includes(elem.id)),
    };
  },

  getAll() {
    return orders;
  },
};

module.exports = {
  ErrorTypes,
  OrderModel,
};
