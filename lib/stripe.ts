import { Account } from "@/types/account";

export const getPlanLabel = (account?: Account) => {
  if (!account) return "Loading...";
  if (!account?.stripe_customer_id) return "Exploring (No Billing Set Up)";
  switch (account?.stripe_price_id) {
    case "price_1RBJv7FbFYF5MTmwhoXYqg5E":
      return "Pay As You Go";
    case "price_1RBJD0FbFYF5MTmwHmoAAKYy":
    case "price_1RBJD0FbFYF5MTmwVY2dJ1vg":
      return "Pro";
    case "price_1RBJFfFbFYF5MTmwHnaLs3WR":
    case "price_1RBJGEFbFYF5MTmwLq6NLnyg":
      return "Pro+";
    case "price_1RBJtGFbFYF5MTmwOoeVlfgY":
    case "price_1RBJtxFbFYF5MTmwJ0D0oDln":
      return "Power";
    default:
      return "Exploring (No Billing Set Up)";
  }
};

export const getPlanPriceId = (label: string, billingType?: string) => {
  if (label === "Pay As You Go") return "price_1RBJv7FbFYF5MTmwhoXYqg5E";
  if (label === "Pro" && billingType === "monthly")
    return "price_1RBJD0FbFYF5MTmwHmoAAKYy";
  if (label === "Pro" && billingType === "annual")
    return "price_1RBJD0FbFYF5MTmwVY2dJ1vg";
  if (label === "Pro+" && billingType === "monthly")
    return "price_1RBJFfFbFYF5MTmwHnaLs3WR";
  if (label === "Pro+" && billingType === "annual")
    return "price_1RBJFfFbFYF5MTmwLq6NLnyg";
  if (label === "Power") return "price_1RBJtGFbFYF5MTmwOoeVlfgY";
  if (label === "Exploring (No Billing Set Up)") return null;
  return null;
};

export const getPlanFromPriceId = (
  priceId: string
): {
  label: string;
  billingType: "monthly" | "annual";
} | null => {
  if (priceId === "price_1RBJv7FbFYF5MTmwhoXYqg5E")
    return {
      label: "Pay As You Go",
      billingType: "monthly",
    };
  if (priceId === "price_1RBJD0FbFYF5MTmwHmoAAKYy")
    return {
      label: "Pro",
      billingType: "monthly",
    };
  if (priceId === "price_1RBJD0FbFYF5MTmwVY2dJ1vg")
    return {
      label: "Pro",
      billingType: "annual",
    };
  if (priceId === "price_1RBJFfFbFYF5MTmwHnaLs3WR")
    return {
      label: "Pro+",
      billingType: "monthly",
    };
  if (priceId === "price_1RBJFfFbFYF5MTmwLq6NLnyg")
    return {
      label: "Pro+",
      billingType: "annual",
    };

  if (priceId === "price_1RBJtGFbFYF5MTmwOoeVlfgY")
    return {
      label: "Power",
      billingType: "monthly",
    };
  if (priceId === "price_1RBJtxFbFYF5MTmwJ0D0oDln")
    return {
      label: "Power",
      billingType: "annual",
    };
  return null;
};
