import { Body, CacheInterceptor, CacheKey, CacheTTL, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { CreateOrderDto } from "./order.model";
import { OrderService } from "./order.service";

@UseInterceptors(CacheInterceptor)
@Controller("order")
export class orderController{
    constructor(private readonly orderService: OrderService){}

    @Post("/add")
    async addorder(
        @Body() createOrderDto: CreateOrderDto,
        @Body('customerName') name:string, 
        @Body('orders') orders:string[], 
        @Body('amount') amount:number
    ){
        const restid= await this.orderService.addorder(name,orders,amount);
        return {id:restid,message:"order Added Successfully!",response:200};
    }

    @Get()
    @CacheKey('orders')
    @CacheTTL(600)
    async getorders(){
        const result= await this.orderService.getAllorders();
        return result;
    }

    @Get(':orderID')
    @CacheTTL(600)
    async getorder(@Param("orderID") id:string){
        const result= await this.orderService.getorder(id);
        return result;
    }
    
    @Patch(':orderID')
    async updateorder(
        @Param("orderID") id:string, 
        @Body("customerName") name:string, 
        @Body("orders") orders:string[],
        @Body("amount") amount:number
    ){
        const updated=await this.orderService.updateorder(id,name,orders,amount);
        return {"response":200,"message":"order Updated Successfully!!","Restraurant":updated};
    }

    @Delete(":orderID")
    async deleteorder(@Param("orderID") id:string){
        await this.orderService.deleteorder(id);
        return {"response":200,"message":"order Deleted Successfully!!"};
    }
}