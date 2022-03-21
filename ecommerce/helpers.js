const { random } = require("lodash");

const randomFailure = () => {
  const result = random(1, 3, false);
  return result === 1;
};

const randomFailureMiddleware = (req, res, next) => {
  if (randomFailure()) {
    return res.status(500).send({ message: "Unexpected error" });
  }
  return next();
};

const randomDelayMiddleware = (req, res, next) => {
  const delay = generateRandomDelay();

  setTimeout(() => {
    next();
  }, delay);
};

const generateRandomDelay = () => {
  const random = Math.floor(Math.random() * 5);
  return [100, 300, 600, 1100, 2000][random];
};

module.exports = { randomFailureMiddleware, randomDelayMiddleware };
