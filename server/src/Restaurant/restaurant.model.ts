import * as mongoose from 'mongoose';

export const restaurantSchema= new mongoose.Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    rating: {type:Number,required:true}
})


export interface Restaurant extends mongoose.Document{
    id: string;
    name: string;
    description: string;
    rating: number;
}