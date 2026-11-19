export type Student = {
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email?: string;
};

export type TableRecord = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
};

/** Invented demo data only — not a real person. */
export const student: Student = {
  firstName: 'Avery',
  lastName: 'Nguyen',
  gender: 'Female',
  mobile: '5551234567',
  email: 'avery.nguyen@example.com',
};

/** Invented demo data only — not a real person. */
export const tableRecord: TableRecord = {
  firstName: 'Riley',
  lastName: 'Brooks',
  email: 'riley.brooks@example.com',
  age: '31',
  salary: '48000',
  department: 'Research',
};

export type TextBoxEntry = {
  fullName: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
};

/** Invented demo data only — not a real person. */
export const textBoxEntry: TextBoxEntry = {
  fullName: 'Jordan Hale',
  email: 'jordan.hale@example.com',
  currentAddress: '18 Market Street',
  permanentAddress: '42 Harbor Lane',
};
