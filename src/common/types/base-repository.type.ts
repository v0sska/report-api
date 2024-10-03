export abstract class BaseRepository<T, Y, H> {
  public abstract create(dto: Y): Promise<T>;
  public abstract find(): Promise<T[]>;
  public abstract findById(id: string): Promise<T>;
  public abstract update(id: string, updates: H): Promise<T>;
  public abstract delete(id: string): Promise<T>;
}
