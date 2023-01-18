import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { restaurantModule } from './Restaurant/restaurant.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';

@Module({
  imports: [
    OrderModule,
    restaurantModule,
    MongooseModule.forRoot(
      'mongodb+srv://shresth:easyeat@learning.fhs5dod.mongodb.net/Learning?retryWrites=true&w=majority',
    ),
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
