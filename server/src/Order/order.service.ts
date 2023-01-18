import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.model";

@Injectable()
export class OrderService{
    // private orders : Order[]=[];
    constructor(@InjectModel('Order') private readonly orderModel:Model<Order>){}

    async addorder(customerName:string, orders: string[], amount:number){
        const neworder = new this.orderModel({customerName,orders,amount});
        const result= await neworder.save();
        return result.id;
    }

    async getAllorders(){
        const allOrders= await this.orderModel.find()
        return allOrders;
    }

    async getorder(id:string){
        const order=await this.findorder(id);
        return order;
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
        return updatedorder;
    }

    async deleteorder(id:string){
        const result=await this.orderModel.deleteOne({_id:id});
        if(result.deletedCount===0){
            throw new NotFoundException("Order Not Found!!");
        }
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