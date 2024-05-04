import { ProductService } from "src/product/product.service";
import { TaskService } from "./task.service";
import { Module } from "@nestjs/common";

@Module({
    providers: [ProductService, TaskService],
  })
  export class AppModule {}