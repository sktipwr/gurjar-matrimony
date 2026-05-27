export interface Profile {
  id: number;
  timestamp: string;
  submittedBy: string;
  relation: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  age: number | null;
  ageRaw: string;
  height: string;
  currentLocation: string;
  hometown: string;
  contact: string;
  gotra: string;
  qualification: string;
  profession: string;
  income: string;
  aboutPerson: string;
  aboutFamily: string;
  photoUrl: string | null;
  bioDataUrl: string | null;
  lookingFor: string;
}

export type GenderFilter = "All" | "Male" | "Female";
export type IncomeFilter = string;

export interface Filters {
  search: string;
  gender: GenderFilter;
  income: string;
  location: string;
  minAge: string;
  maxAge: string;
}
