export interface Pet {
  id: number;
  name: string;
  photo: string;
  species: string;
  breed: string;
  birthDate: string;
  weight: number | string;
  gender: "Male" | "Female" | string;
  color?: string;
  notes: string;
}
