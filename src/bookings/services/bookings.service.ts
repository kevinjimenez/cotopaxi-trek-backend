import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateBookingInput } from '../dto/create-booking.input';
import { BookingsRepository } from '../repositories/bookings.repository';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  create(payload: CreateBookingInput) {
    return this.bookingsRepository.create(payload);
  }

  createMany(payload: CreateBookingInput[], tx?: PrismaTransaction) {
    return this.bookingsRepository.createMany(payload, tx);
  }

  findAll(tx?: PrismaTransaction) {
    return this.bookingsRepository.findAll(tx);
  }
}
