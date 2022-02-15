const express = require("express");
const validator = require("validator");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require('cors')

var jsonParser = bodyParser.json();

const app = express();

app.use(jsonParser);
app.use(cors())

const users = [];

app.get("/", (req, res) => {
  return res.send(users);
});

app.get("/users/me", (req, res) => {
  const authHeader = req.headers["authorization"];

  try {
    const decoded = jwt.verify(authHeader, "bananas");

    const userEmail = decoded.email;

    const existingUser = users.find((elem) => elem.email === userEmail);

    if (existingUser) {
      return res.status(200).send({ email: existingUser.email });
    }

    return res.status(401).send({ message: "Invalid credentials" });
  } catch (err) {
    return res.status(401).send({ message: "Invalid credentials" });
  }
});

app.post("/login", (req, res) => {
  const data = req.body || { email: "", password: "" };

  const validEmail =
    typeof data.email === "string" && validator.isEmail(data.email);

  const validPassword =
    typeof data.password === "string" &&
    validator.isLength(data.password, { min: 5, max: 20 });

  if (validEmail && validPassword) {
    const existingUser = users.find(
      (elem) => elem.email === data.email && elem.password === data.password
    );

    if (existingUser) {
      const token = jwt.sign({ email: data.email }, "bananas", {
        expiresIn: 120,
      });

      return res.status(200).send({ token });
    }

    return res.status(401).send({ message: "Invalid credentials" });
  }

  return res.status(400).send({ message: "Invalid payload" });
});

app.post("/register", (req, res) => {
  const data = req.body || { email: "", password: "" };

  const validEmail =
    typeof data.email === "string" && validator.isEmail(data.email);

  const validPassword =
    typeof data.password === "string" &&
    validator.isLength(data.password, { min: 5, max: 20 });

  if (validEmail && validPassword) {
    if (users.find((elem) => elem.email === data.email)) {
      return res
        .status(403)
        .send({ message: "User with that email already exists" });
    }

    const newUser = { email: data.email, password: data.password };
    users.push(newUser);

    return res.status(200).send({ message: "Success" });
  }

  return res.status(400).send({ message: "Invalid payload" });
});

app.listen(8080, () =>
  console.log(`Auth API listening on http://localhost:8080`)
);
