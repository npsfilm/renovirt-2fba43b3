
// Local type definitions for new database structures
export interface OrderNotification {
  id: string;
  order_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface ExtendedOrder {
  id: string;
  user_id: string;
  package_id?: string;
  customer_email?: string;
  photo_type?: string;
  image_count: number;
  total_price: number;
  bracketing_enabled?: boolean;
  bracketing_exposures?: number;
  terms_accepted?: boolean;
  status?: string;
  created_at: string;
  updated_at: string;
  order_number?: string;
  payment_status?: string;
  admin_notes?: string;
  delivery_status?: string;
  customer_profiles?: {
    first_name: string;
    last_name: string;
    company?: string;
    phone?: string;
    address?: string;
  } | null;
  order_images?: Array<{
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    storage_path: string;
    created_at: string;
  }>;
  packages?: {
    name: string;
    description?: string;
  } | null;
}
