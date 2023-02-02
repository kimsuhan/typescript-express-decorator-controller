import { Controller, Delete, Get, Post, Put } from "../../decorator";

@Controller("/sample")
export class SampleController {
  @Get("/")
  async get() {
    return "Get Call";
  }

  @Post("/")
  async post() {
    console.log("post");
  }

  @Put("/")
  async put() {
    console.log("put");
  }

  @Delete("/")
  async delete() {
    console.log("delete");
  }
}
