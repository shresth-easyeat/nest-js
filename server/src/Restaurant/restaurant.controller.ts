import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateRestaurantDto } from './restaurant.model';
import { RestaurantService } from './restaurant.service';

@UseInterceptors(CacheInterceptor)
@Controller('restaurant')
export class restaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('/add')
  async addrestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Body('name') name: string,
    @Body('description') desc: string,
    @Body('rating') rate: number,
  ) {
    const restid = await this.restaurantService.addrestaurant(name, desc, rate);
    return {
      id: restid,
      message: 'restaurant Added Successfully!',
      response: 200,
    };
  }

  @Get()
  @CacheKey('restaurants')
  @CacheTTL(600)
  getrestaurants() {
    return this.restaurantService.getAllrestaurants();
  }

  @Get(':restaurantID')
  @CacheTTL(600)
  getrestaurant(@Param('restaurantID') id: string) {
    return this.restaurantService.getrestaurant(id);
  }

  @Patch(':restaurantID')
  async updaterestaurant(
    @Param('restaurantID') id: string,
    @Body('name') name: string,
    @Body('description') desc: string,
    @Body('rating') rating: number,
  ) {
    const updated = await this.restaurantService.updaterestaurant(
      id,
      name,
      desc,
      rating,
    );
    return {
      response: 200,
      message: 'restaurant Updated Successfully!!',
      Restraurant: updated,
    };
  }

  @Delete(':restaurantID')
  async deleterestaurant(@Param('restaurantID') id: string) {
    await this.restaurantService.deleterestaurant(id);
    return { response: 200, message: 'restaurant Deleted Successfully!!' };
  }
}
