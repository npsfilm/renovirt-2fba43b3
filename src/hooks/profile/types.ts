
export interface CustomerProfileData {
  role: string;
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  billingEmail?: string;
  vatId?: string;
  address: string;
  phone: string;
  dataSource: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
