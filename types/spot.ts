export type Spot = {
  id: string;
  name: string;
  category: string;
  description: string;
  note: string;
  tags: string[];
  hours: string;
  payment: string;
  insideStation: boolean;
  lat: number;
  lng: number;
};
