"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, ButtonProps } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useDynamicContext,
  useIsLoggedIn,
  getAuthToken,
} from "@dynamic-labs/sdk-react-core";
import {
  CreditCardIcon,
  CodeBracketIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CheckIcon,
  BoltIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/components/auth-provider";
import clsx from "clsx";
import { getPlanLabel, getPlanFromPriceId } from "@/lib/stripe";
import SplashComponent from "./SplashComponent";
import { AutoTopupCard } from "./AutoTopupCard";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = useIsLoggedIn();
  const { setShowAuthFlow } = useDynamicContext();
  const { account } = useAuth();
  const [autoTopupThreshold, setAutoTopupThreshold] = useState(1000);
  const [autoTopupAmount, setAutoTopupAmount] = useState(10000);
  const [autoTopupSaved, setAutoTopupSaved] = useState(false);
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null);

  const [currentPlan, setCurrentPlan] = useState<{
    label: string;
    billingType: "monthly" | "annual";
  } | null>(null);

  useEffect(() => {
    if (account?.stripe_price_id) {
      const priceId = account.stripe_price_id;
      setCurrentPriceId(priceId);
      const plan = getPlanFromPriceId(priceId);
      if (plan) {
        setCurrentPlan(plan);
      }
    }
  }, [account]);

  // Calculate prices based on billing period
  const getPriceDisplay = (monthlyPrice: number) => {
    if (billingPeriod === "annual") {
      const annualPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount
      return {
        price: Math.round(annualPrice / 12),
        period: "/month",
        subtitle: `billed annually at $${annualPrice.toLocaleString()}`,
      };
    }
    return {
      price: monthlyPrice,
      period: "/month",
      subtitle: "billed monthly",
    };
  };

  const starterPrice = getPriceDisplay(49);
  const proPlusPrice = getPriceDisplay(999);

  // --- Stripe Checkout Handler ---
  const handleCheckout = async (priceId: string) => {
    setError(null);
    if (!isLoggedIn) {
      setError("Please log in to proceed with checkout.");
      toast.error("Please log in first.");
      setShowAuthFlow(true);
      return;
    }
    if (!stripePromise || !process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
      setError("Stripe is not properly configured.");
      toast.error("Stripe is not properly configured.");
      return;
    }
    setLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Failed to retrieve authentication token.");
      }

      const quantity = priceId === "price_1RBJv7FbFYF5MTmwhoXYqg5E" ? 100 : 1;

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: priceId,
          accountId: account?.id,
          quantity: quantity,
        }),
      });

      const { sessionId, error: apiError } = await response.json();

      if (!response.ok || apiError) {
        throw new Error(apiError || "Failed to create checkout session.");
      }

      if (!sessionId) {
        throw new Error("Missing session ID from server.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js failed to load.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        console.error("Stripe redirection error:", stripeError);
        throw new Error(stripeError.message || "Stripe redirection failed.");
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      const errorMessage =
        err.message || "An unexpected error occurred during checkout.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSaveAutoTopup = async () => {
    setError(null);
    if (!isLoggedIn) {
      setError("Please log in to save auto top-up settings.");
      toast.error("Please log in first.");
      setShowAuthFlow(true);
      return;
    }
    setLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Failed to retrieve authentication token.");
      }

      const response = await fetch("/api/account/auto-topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          threshold: autoTopupThreshold,
          amount: autoTopupAmount,
        }),
      });

      const { success, error: apiError } = await response.json();

      if (!response.ok || !success) {
        throw new Error(apiError || "Failed to save auto top-up settings.");
      }

      setAutoTopupSaved(true);
      toast.success("Auto top-up settings saved successfully.");
    } catch (err: any) {
      console.error("Auto Top-Up Error:", err);
      const errorMessage =
        err.message ||
        "An unexpected error occurred while saving auto top-up settings.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchAutoTopup = async () => {
      try {
        const token = await getAuthToken();
        const response = await fetch("/api/account/auto-topup", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const { threshold, amount } = await response.json();
        if (threshold) setAutoTopupThreshold(threshold);
        if (amount) setAutoTopupAmount(amount);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAutoTopup();
  }, [isLoggedIn, getAuthToken]);

  if (!isLoggedIn) {
    return <SplashComponent setShowAuthFlow={setShowAuthFlow} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">
        <div className="border-b">
          <div className="container flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
        </div>

        <div className="p-4 md:p-8 mx-auto max-w-7xl space-y-8">
          <Tabs defaultValue="billing" className="space-y-8">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground relative w-full space-x-1">
              <TabsTrigger
                value="billing"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              {/* <TabsTrigger
                value="api"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              >
                <CodeBracketIcon className="mr-2 h-4 w-4" />
                API
              </TabsTrigger> */}
            </TabsList>

            {/* Billing Section */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    {account?.stripe_customer_id ? (
                      <span>
                        Your current plan: <b>{currentPlan?.label}</b>
                      </span>
                    ) : (
                      <span>
                        You are currently exploring the platform. Billing is not
                        set up yet. Enjoy your free credits!
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Current Plan Banner */}
                  <div className="rounded-xl bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border border-blue-200 p-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-blue-900">
                            {currentPlan?.label}
                          </h3>
                          {account?.stripe_customer_id ? (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              {currentPlan?.billingType === "monthly"
                                ? "Monthly"
                                : "Annually"}
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              Free Trial
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          {account?.stripe_customer_id
                            ? "Your subscription is active."
                            : "You have free credits to explore the platform. Upgrade or add billing when you're ready!"}
                        </p>
                      </div>
                    </div>
                    <AutoTopupCard
                      autoTopupEnabled={true}
                      setAutoTopupEnabled={() => {}}
                      autoTopupThreshold={autoTopupThreshold}
                      setAutoTopupThreshold={setAutoTopupThreshold}
                      autoTopupAmount={autoTopupAmount}
                      setAutoTopupAmount={setAutoTopupAmount}
                      handleSaveAutoTopup={handleSaveAutoTopup}
                      loading={loading}
                      autoTopupSaved={autoTopupSaved}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Available Plans</h3>
                      <Select
                        defaultValue="monthly"
                        onValueChange={(value) => setBillingPeriod(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Billing Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">
                            Monthly Billing
                          </SelectItem>
                          <SelectItem value="annual">
                            Annual Billing (20% off)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Basic Tier */}
                      <PayAsYouGoCard
                        priceId="price_1RBJv7FbFYF5MTmwhoXYqg5E"
                        autoTopupThreshold={autoTopupThreshold}
                        setAutoTopupThreshold={setAutoTopupThreshold}
                        autoTopupAmount={autoTopupAmount}
                        setAutoTopupAmount={setAutoTopupAmount}
                        handleSaveAutoTopup={handleSaveAutoTopup}
                        loading={loading}
                        autoTopupSaved={autoTopupSaved}
                        disabled={!account?.stripe_customer_id}
                        handleCheckout={handleCheckout}
                      />

                      {/* Starter (Pro) Tier */}
                      <ProCard
                        autoTopupThreshold={autoTopupThreshold}
                        setAutoTopupThreshold={setAutoTopupThreshold}
                        autoTopupAmount={autoTopupAmount}
                        setAutoTopupAmount={setAutoTopupAmount}
                        handleSaveAutoTopup={handleSaveAutoTopup}
                        loading={loading}
                        autoTopupSaved={autoTopupSaved}
                        handleCheckout={handleCheckout}
                        disabled={!account?.stripe_customer_id}
                        billingPeriod={billingPeriod}
                        subscriptionPackage={starterPrice}
                        priceId="price_1RBJD0FbFYF5MTmwHmoAAKYy"
                      />

                      {/* Pro+ Tier */}
                      <ProPlusCard
                        autoTopupThreshold={autoTopupThreshold}
                        setAutoTopupThreshold={setAutoTopupThreshold}
                        autoTopupAmount={autoTopupAmount}
                        setAutoTopupAmount={setAutoTopupAmount}
                        handleSaveAutoTopup={handleSaveAutoTopup}
                        loading={loading}
                        autoTopupSaved={autoTopupSaved}
                        handleCheckout={handleCheckout}
                        disabled={!account?.stripe_customer_id}
                        billingPeriod={billingPeriod}
                      />

                      {/* Power Tier */}
                      <PowerCard
                        handleCheckout={handleCheckout}
                        disabled={!account?.stripe_customer_id}
                        billingPeriod={billingPeriod}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Section */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Securely manage your API keys for accessing Formation
                    services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Production Key */}
                  <div className="rounded-xl border bg-white">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-base font-medium">
                            Production API Key
                          </Label>
                          <p className="text-sm text-gray-500">
                            Use this key for your production environment
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Revoke
                          </Button>
                          <Button variant="outline" size="sm">
                            Regenerate
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="text"
                            value="sk_live_xxxxxxxxxxxxx"
                            className="pr-24 font-mono text-sm bg-gray-50"
                            readOnly
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <span className="text-xs font-medium text-gray-400">
                              •••• 4289
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 w-24 font-medium"
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Active
                        </span>
                        <span>•</span>
                        <span>Last used 2 hours ago</span>
                        <span>•</span>
                        <span>Created Mar 15, 2024</span>
                      </div>
                    </div>
                    <div className="border-t bg-gray-50 p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <CodeBracketIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Quick Start</p>
                          <p className="text-sm text-gray-500">
                            Make your first API call using cURL:
                          </p>
                          <div className="mt-2 relative rounded-lg bg-gray-900 p-4">
                            <code className="text-sm font-mono text-gray-200">
                              curl https://network.formation.cloud/v1/agents \
                              <br />
                              &nbsp;&nbsp;-H "Authorization: Bearer
                              $YOUR_API_KEY" \<br />
                              &nbsp;&nbsp;-H "Content-Type: application/json"
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Key */}
                  <div className="rounded-xl border bg-white">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-base font-medium">
                            Test API Key
                          </Label>
                          <p className="text-sm text-gray-500">
                            Use this key for testing and development
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Revoke
                          </Button>
                          <Button variant="outline" size="sm">
                            Regenerate
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="text"
                            value="sk_test_xxxxxxxxxxxxx"
                            className="pr-24 font-mono text-sm bg-gray-50"
                            readOnly
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <span className="text-xs font-medium text-gray-400">
                              •••• 7891
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 w-24 font-medium"
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Active
                        </span>
                        <span>•</span>
                        <span>Last used 5 days ago</span>
                        <span>•</span>
                        <span>Created Mar 1, 2024</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Security */}
                  <div className="rounded-xl border bg-gradient-to-b from-gray-50 to-white p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-amber-100">
                        <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Secure Your API Keys</p>
                        <p className="text-sm text-gray-500">
                          Never share your API keys in publicly accessible areas
                          such as GitHub, client-side code, or support tickets.
                          Need help? Check out our{" "}
                          <Link
                            href="/marketplace/settings/security"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            security best practices
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

const PlanSelectButton = ({
  children,
  selected,
  onClick,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  props?: any;
}) => {
  return (
    <Button
      className={clsx(
        "w-full h-11 mt-6 rounded-full font-medium bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center",
        selected && "bg-blue-500 text-white"
      )}
      onClick={onClick}
      disabled={disabled || selected}
      {...props}
    >
      {selected ? "Current Plan" : children}
    </Button>
  );
};
const PayAsYouGoCard = ({
  autoTopupThreshold,
  setAutoTopupThreshold,
  autoTopupAmount,
  setAutoTopupAmount,
  handleSaveAutoTopup,
  loading,
  autoTopupSaved,
  handleCheckout,
  disabled,
  priceId,
}: {
  autoTopupThreshold: number;
  setAutoTopupThreshold: (threshold: number) => void;
  autoTopupAmount: number;
  setAutoTopupAmount: (amount: number) => void;
  handleSaveAutoTopup: () => void;
  autoTopupSaved: boolean;
  handleCheckout: (priceId: string) => void;
  loading: boolean;
  disabled: boolean;
  priceId: string;
}) => {
  const { account } = useAuth();
  const isSelected = getPlanLabel(account) === "Pay As You Go";
  const accountPriceId = account?.stripe_price_id?.split("_")[1];
  const isCurrentPlan = `price_${accountPriceId}` === priceId;

  return (
    <div
      className={clsx(
        "rounded-xl border border-2 p-6 bg-white hover:border-blue-200 hover:shadow-lg transition-all flex flex-col min-h-[480px]",
        isCurrentPlan && "border-formation-blue"
      )}
    >
      <div className="flex-1 flex flex-col">
        <h4 className="text-lg font-semibold">Pay As You Go</h4>
        <p className="text-sm text-gray-500 mt-1">
          Perfect for testing and small projects
        </p>
        <div className="mt-5">
          <span className="text-3xl font-bold">$0.01</span>
          <span className="text-gray-500">/credit</span>
        </div>
        <ul className="mt-5 space-y-2.5">
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            No monthly commitment
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Pay only for what you use
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Basic support
          </li>
        </ul>
      </div>
      <PlanSelectButton
        onClick={() => handleCheckout("price_1RBJv7FbFYF5MTmwhoXYqg5E")}
        disabled={disabled || isSelected}
        selected={isSelected}
      >
        {isSelected ? "Current Plan" : "Change to Pay As You Go"}
      </PlanSelectButton>
    </div>
  );
};

const ProCard = ({
  handleCheckout,
  subscriptionPackage,
  disabled,
  billingPeriod,
  priceId,
}: {
  autoTopupThreshold: number;
  setAutoTopupThreshold: (threshold: number) => void;
  autoTopupAmount: number;
  setAutoTopupAmount: (amount: number) => void;
  handleSaveAutoTopup: () => void;
  loading: boolean;
  autoTopupSaved: boolean;
  handleCheckout: (priceId: string) => void;
  disabled: boolean;
  billingPeriod: string;
  subscriptionPackage: {
    price: number;
    period: string;
    subtitle: string;
  };
  priceId: string;
}) => {
  const { account } = useAuth();
  const isSelected = getPlanLabel(account) === "Pro";
  const accountPriceId = account?.stripe_price_id?.split("_")[1];
  const isCurrentPlan = `price_${accountPriceId}` === priceId;
  return (
    <div
      className={clsx(
        "rounded-xl border border-2 p-6 bg-white hover:border-blue-200 hover:shadow-lg transition-all flex flex-col min-h-[480px]",
        isCurrentPlan && "border-formation-blue"
      )}
    >
      <div className="flex-1">
        <h4 className="text-lg font-semibold">Pro</h4>
        <p className="text-sm text-gray-500 mt-1">
          For individuals and small teams
        </p>
        <div className="mt-5">
          <span className="text-3xl font-bold">
            ${subscriptionPackage.price}
          </span>
          <span className="text-gray-500">{subscriptionPackage.period}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {subscriptionPackage.subtitle}
        </p>
        <p className="text-sm text-gray-500 mt-1">Includes 12,000 credits</p>
        <ul className="mt-5 space-y-2.5">
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            $0.0045 per additional credit
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Email support
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Basic analytics
          </li>
        </ul>
      </div>
      <PlanSelectButton
        disabled={disabled || isSelected}
        onClick={() => handleCheckout(priceId)}
        selected={isSelected}
      >
        {isSelected ? "Current Plan" : "Upgrade to Pro"}
      </PlanSelectButton>
    </div>
  );
};

const ProPlusCard = ({
  handleCheckout,
  disabled,
  billingPeriod,
}: {
  autoTopupThreshold: number;
  setAutoTopupThreshold: (threshold: number) => void;
  autoTopupAmount: number;
  setAutoTopupAmount: (amount: number) => void;
  handleSaveAutoTopup: () => void;
  loading: boolean;
  autoTopupSaved: boolean;
  handleCheckout: (priceId: string) => void;
  disabled: boolean;
  billingPeriod: string;
}) => {
  const { account } = useAuth();
  const isSelected = getPlanLabel(account) === "Pro+";
  return (
    <div className="rounded-xl border p-6 bg-gradient-to-b from-blue-50 to-white relative hover:shadow-lg transition-all flex flex-col min-h-[480px]">
      <div className="absolute -top-2 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
        Most Popular
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-semibold">Pro+</h4>
        <p className="text-sm text-gray-500 mt-1">
          For growing teams and applications
        </p>
        <div className="mt-5">
          <span className="text-3xl font-bold">
            {billingPeriod === "annual" ? "$1669" : "$199"}
          </span>
          <span className="text-gray-500">
            {billingPeriod === "annual" ? "/year" : "/month"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {billingPeriod === "annual"
            ? "billed annually at $1669"
            : "billed monthly"}
        </p>
        <p className="text-sm text-gray-500 mt-1">Includes 250,000 credits</p>
        <ul className="mt-5 space-y-2.5">
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            $0.004 per additional credit
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Priority support
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Advanced analytics
          </li>
        </ul>
      </div>
      <PlanSelectButton
        onClick={() =>
          handleCheckout(
            billingPeriod === "annual"
              ? "price_1RBJGEFbFYF5MTmwLq6NLnyg"
              : "price_1RBJFfFbFYF5MTmwHnaLs3WR"
          )
        }
        disabled={disabled || isSelected}
        selected={isSelected}
      >
        {getPlanLabel(account)}
      </PlanSelectButton>
    </div>
  );
};

const PowerCard = ({ handleCheckout, disabled, billingPeriod }) => {
  const { account } = useAuth();
  const isSelected = getPlanLabel(account) === "Power";
  return (
    <div className="rounded-xl border p-6 bg-gradient-to-b from-purple-50 to-white hover:shadow-lg transition-all flex flex-col min-h-[480px]">
      <div className="flex-1">
        <h4 className="text-lg font-semibold">Power</h4>
        <p className="text-sm text-gray-500 mt-1">
          For large-scale deployments
        </p>
        <div className="mt-5">
          <span className="text-3xl font-bold">
            {billingPeriod === "annual" ? "$8399" : "$999"}
          </span>
          <span className="text-gray-500">
            {billingPeriod === "annual" ? "/year" : "/month"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {billingPeriod === "annual"
            ? "billed annually at $8399"
            : "billed monthly"}
        </p>
        <ul className="mt-5 space-y-2.5">
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Unlimited credits available
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            24/7 dedicated support
          </li>
          <li className="flex items-center text-sm text-gray-600">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Custom integrations
          </li>
        </ul>
      </div>
      <PlanSelectButton
        disabled={disabled || isSelected}
        onClick={() =>
          handleCheckout(
            billingPeriod === "annual"
              ? "price_1RBJtxFbFYF5MTmwJ0D0oDln"
              : "price_1RBJtGFbFYF5MTmwOoeVlfgY"
          )
        }
        selected={isSelected}
      >
        {getPlanLabel(account)}
      </PlanSelectButton>
    </div>
  );
};
