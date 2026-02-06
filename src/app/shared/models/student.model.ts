export interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

export interface StudentForm {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}
