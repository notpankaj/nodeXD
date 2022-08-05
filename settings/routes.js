const api = require("../api");
const fs = require("fs");
const specs = require("../specs");
const auth = require("../permit/auth");
const configure = (app) => {
  app.get("/specs", function (req, res) {
    fs.readFile("./public/specs.html", function (err, data) {
      if (err) {
        return res.json({
          isSuccess: false,
          error: err.toString(),
        });
      }
      res.contentType("text/html");
      res.send(data);
    });
  });

  app.get("/api/specs", function (req, res) {
    res.contentType("application/json");
    res.send(specs.get());
  });

  // ^ WELCOME
  app.get("/", (req, res) =>
    res.send({ message: "welcome to node world∂∂!." })
  );

  // * USER
  app.post("/api/users/login", api.users.login);
  app.post("/api/users/create", api.users.create);
  app.put("/api/users/update/:id", auth.validateToken, api.users.update);
  app.get("/api/users/profile/:id", api.users.get);
  app.delete("/api/users/delete/:id", api.users.deleteUser);
  app.patch("/api/users/recover/:id", api.users.recoverUser);

  // ! STORE
  app.post("/api/store/create", api.stores.create);
  app.get("/api/store/get/:id", api.stores.get);

  // ! product
  app.get("/api/product/all", api.products.getAll);
  app.post("/api/product/create", api.products.create);
  app.get("/api/product/view/:id", api.products.get);
  app.put("/api/product/update/:id", api.products.update);
  app.delete("/api/product/delete/:id", api.products.delete);
};

exports.configure = configure;
