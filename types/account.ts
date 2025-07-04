export interface Account {
  id: string;
  dynamic_id: string;
  primary_address: string;
  created_at: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  credit_balance?: number;
  default_payment_method?: string;
  auto_topup_enabled?: boolean;
  auto_topup_threshold?: number;
  auto_topup_amount?: number;
  [key: string]: any;
}
