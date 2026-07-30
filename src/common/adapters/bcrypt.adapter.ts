import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingAdapter } from '../interfaces/hashing-adapter.interface';

@Injectable()
export class BcryptAdapter implements HashingAdapter {
  hash(plain: string): string {
    return bcrypt.hashSync(plain, 10);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plain, hash);
    } catch (e) {
      console.log(e);
      throw new Error('Error comparing password - Check logs');
    }
  }
}
