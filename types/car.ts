export interface Car {
  id: number;
  year: number;
  name: string;
  price: number;
  city: string;
  make: string;
  url: string;
  seats: 5;
  miles: string;
  features: string[];
  description: string;
}

export type Cars = Car[];
