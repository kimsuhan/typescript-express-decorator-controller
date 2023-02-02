import express from "express";
import "reflect-metadata";
import { router } from "./modules/router/router.module";

class App {
  public application: express.Application;

  constructor() {
    const app = express();

    app.use("/v1", router);

    this.application = app;
  }
}

const app = new App().application;

app.listen(3000, () => {
  console.log("Server Start In 3000 Port");
});
