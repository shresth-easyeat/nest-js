import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cache } from "cache-manager";
import { Model } from "mongoose";
import { Restaurant } from "./restaurant.model";

@Injectable()
export class restaurantService{
    // private restaurants : Restaurant[]=[];

    constructor(
        @InjectModel('Restaurant') private readonly restaurantModel:Model<Restaurant>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ){

    }
    async addrestaurant(name:string, desc: string, rating:number){
        const newrestaurant = new this.restaurantModel({name:name,description:desc,rating:rating});
        const result= await newrestaurant.save();
        this.cacheManager.del('restaurants');
        return result.id;
    }
    async getAllrestaurants(){
        let restaurants=await this.cacheManager.get('restaurants');
        if(!restaurants){
            restaurants=await this.restaurantModel.find().exec();
            await this.cacheManager.set('restaurants',restaurants)
            console.log(restaurants);
        }
        return restaurants;
    }
    async getrestaurant(id:string){
        const key="rest"+id;
        let restaurant=await this.cacheManager.get(key);
        if(!restaurant){
            restaurant=await this.findrestaurant(id);
            this.cacheManager.set(key,restaurant);
        }
        return restaurant;
    }

    async updaterestaurant(id:string,name:string,desc:string,rating:number){
        const updatedrestaurant=await this.findrestaurant(id);
        if(name){
            updatedrestaurant.name=name;
        }
        if(desc){
            updatedrestaurant.description=desc;
        }
        if(rating){
            updatedrestaurant.rating=rating;
        }
        updatedrestaurant.save();
        this.cacheManager.del('restaurants');
        this.cacheManager.del('rest'+id);
        return updatedrestaurant;
    }

    async deleterestaurant(id:string){
        // const restaurant=await this.findrestaurant(id);
        const result=await this.restaurantModel.deleteOne({_id:id}).exec();
        this.cacheManager.del('restaurants');
        this.cacheManager.del('rest'+id);
        if(result.deletedCount===0){
            throw new NotFoundException("Restaurant Not Found!!");
        }
    }

    private async findrestaurant(id:string):Promise<Restaurant>{
        let restaurant;
        try{
            restaurant=await this.restaurantModel.findById(id);
        }
        catch(error){
            throw new NotFoundException("Restaurant Not Found!!");
        }
        if(!restaurant){
            throw new NotFoundException("Restaurant Not Found!!");
        }
        return restaurant;
    }
}