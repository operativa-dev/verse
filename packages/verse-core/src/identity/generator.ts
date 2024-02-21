export interface IdGenerator<T> {
  next(): Promise<T>;
}
