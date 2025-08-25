
import { sanitizeInput } from '@/utils/inputValidation';
import { CustomerProfileData } from './types';

export const useProfileSanitization = () => {
  const sanitizeProfileData = (data: CustomerProfileData): CustomerProfileData => {
    return {
      role: data.role,
      salutation: data.salutation?.toLowerCase(),
      firstName: sanitizeInput(data.firstName),
      lastName: sanitizeInput(data.lastName),
      company: sanitizeInput(data.company),
      billingEmail: data.billingEmail ? sanitizeInput(data.billingEmail) : undefined,
      vatId: data.vatId ? sanitizeInput(data.vatId) : undefined,
      address: sanitizeInput(data.address),
      phone: sanitizeInput(data.phone),
      dataSource: sanitizeInput(data.dataSource),
    };
  };

  return { sanitizeProfileData };
};
