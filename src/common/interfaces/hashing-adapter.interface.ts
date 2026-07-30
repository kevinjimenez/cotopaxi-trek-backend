export interface HashingAdapter {
  hash(plain: string): string;
  compare(plain: string, hash: string): Promise<boolean>;
}
