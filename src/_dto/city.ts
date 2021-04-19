export class CityDto {
  id?: number;
  city: string;
  country: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}
