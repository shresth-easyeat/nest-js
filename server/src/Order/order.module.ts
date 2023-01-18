import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { orderController } from "./order.controller";
import { orderSchema } from "./order.model";
import { OrderService } from "./order.service";

@Module({
    imports:[MongooseModule.forFeature([{name:'Order', schema:orderSchema}])],
    controllers: [orderController],
    providers: [OrderService]
})
export class OrderModule{}