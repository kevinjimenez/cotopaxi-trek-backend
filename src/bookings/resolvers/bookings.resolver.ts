import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBookingInput } from '../dto/create-booking.input';
import { Booking } from '../models/booking.model';
import { BookingsService } from '../services/bookings.service';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Mutation(() => Booking)
  createBooking(
    @Args('createBookingInput') createBookingInput: CreateBookingInput,
  ) {
    return this.bookingsService.create(createBookingInput);
  }

  @Query(() => [Booking], { name: 'bookings' })
  findAll() {
    return this.bookingsService.findAll();
  }
}
