import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { restaurantController } from './restaurant.controller';
import { restaurantSchema } from './restaurant.model';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: restaurantSchema },
    ]),
  ],
  controllers: [restaurantController],
  providers: [RestaurantService],
})
export class restaurantModule {}
