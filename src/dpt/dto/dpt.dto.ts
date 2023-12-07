import { Expose } from 'class-transformer';

export class DptDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  name: string;
  @Expose()
  role: string;
}
