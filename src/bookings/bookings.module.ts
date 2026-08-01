import { Module } from '@nestjs/common';
import { BookingsRepository } from './repositories/bookings.repository';
import { BookingsResolver } from './resolvers/bookings.resolver';
import { BookingsService } from './services/bookings.service';

@Module({
  providers: [BookingsResolver, BookingsService, BookingsRepository],
  exports: [BookingsService],
})
export class BookingsModule {}
