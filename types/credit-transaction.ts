export interface CreditTransaction {
  id: string;
  account_id: string;
  amount: number;
  transaction_type: "purchase" | "usage" | "refund";
  stripe_payment_intent_id?: string;
  created_at: string;
}
