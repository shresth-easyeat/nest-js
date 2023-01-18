import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.model";
import { Cache } from "cache-manager";

@Injectable()
export class OrderService{
    // private orders : Order[]=[];
    constructor(
        @InjectModel('Order') private readonly orderModel:Model<Order>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ){}

    async addorder(customerName:string, orders: string[], amount:number){
        const neworder = new this.orderModel({customerName,orders,amount});
        const result= await neworder.save();
        this.cacheManager.del('orders');
        return result.id;
    }

    async getAllorders(){
        let orders=await this.cacheManager.get('orders');
        if(!orders){
            orders=await this.orderModel.find().exec();
            await this.cacheManager.set('orders',orders)
            // console.log(orders);
        }
        return orders;
    }

    async getorder(id:string){
        const key="order"+id;
        let ord=await this.cacheManager.get(key);
        if(!ord){
            ord=await this.findorder(id);
            this.cacheManager.set(key,ord);
            // console.log(ord);
        }
        return ord;
    }

    async updateorder(id:string,name:string,orders:string[],amount:number){
        const updatedorder=await this.findorder(id);
        if(name){
            updatedorder.customerName=name;
        }
        if(orders){
            updatedorder.orders=orders;
        }
        if(amount){
            updatedorder.amount=amount;
        }
        updatedorder.save();
        this.cacheManager.del('orders');
        this.cacheManager.del('order'+id);
        return updatedorder;
    }

    async deleteorder(id:string){
        const result=await this.orderModel.deleteOne({_id:id});
        if(result.deletedCount===0){
            throw new NotFoundException("Order Not Found!!");
        }
        this.cacheManager.del('orders');
        this.cacheManager.del('order'+id);
        return null;
    }

    private findorder(id:string):Promise<Order>{
        let order;
        try{
            order=this.orderModel.findById(id);
        }catch(error){
            throw new NotFoundException("order Not Found!!");
        }
        if(!order){
            throw new NotFoundException("order Not Found!!");
            // return {"response":404, "Message":"order not found!!"};
        }
        return order;
    }
}