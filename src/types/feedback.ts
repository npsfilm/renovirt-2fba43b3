// Temporary types for feedback system until Supabase types are updated
export interface FeatureCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category_id: string;
  created_by: string;
  status: 'open' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  upvote_count: number;
  comment_count: number;
  admin_response?: string;
  estimated_completion?: string;
  created_at: string;
  updated_at: string;
  feature_categories?: FeatureCategory;
  customer_profiles?: {
    first_name: string;
    last_name: string;
  };
}

export interface FeatureUpvote {
  id: string;
  feature_request_id: string;
  user_id: string;
  created_at: string;
}

export interface FeatureComment {
  id: string;
  feature_request_id: string;
  user_id: string;
  content: string;
  is_admin_response: boolean;
  created_at: string;
  customer_profiles?: {
    first_name: string;
    last_name: string;
  };
}