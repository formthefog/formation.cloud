'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import {
  CreditCardIcon,
  CodeBracketIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const isLoggedIn = useIsLoggedIn();
  const { setShowAuthFlow, handleLogOut } = useDynamicContext();

  // Calculate prices based on billing period
  const getPriceDisplay = (monthlyPrice: number) => {
    if (billingPeriod === 'annual') {
      const annualPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount
      return {
        price: Math.round(annualPrice / 12),
        period: '/month',
        subtitle: `billed annually at $${annualPrice.toLocaleString()}`
      };
    }
    return {
      price: monthlyPrice,
      period: '/month',
      subtitle: 'billed monthly'
    };
  };

  const starterPrice = getPriceDisplay(49);
  const proPrice = getPriceDisplay(999);

  const onLogout = async () => {
    try {
      await handleLogOut();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex-1">
          <div className="border-b">
            <div className="container flex h-16 items-center px-4">
              <h1 className="text-lg font-semibold">Get Started</h1>
            </div>
          </div>

          <div className="container p-4 md:p-8 mx-auto max-w-5xl">
            <div className="max-w-2xl mx-auto">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
                <CardHeader className="relative">
                  <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                    <SparklesIcon className="w-8 h-8 text-blue-500" />
                    Welcome to Formation
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sign in to access your API keys, manage billing, and deploy AI agents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                      <RocketLaunchIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Quick Deployment</h3>
                        <p className="text-sm text-muted-foreground">Deploy AI agents in under 60 seconds with our streamlined process.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                      <CodeBracketIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">API Access</h3>
                        <p className="text-sm text-muted-foreground">Get instant access to our API and start integrating AI capabilities.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                      <CreditCardIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Simple Billing</h3>
                        <p className="text-sm text-muted-foreground">Pay-per-use pricing with no hidden fees or long-term commitments.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                      <ShieldCheckIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Enterprise Ready</h3>
                        <p className="text-sm text-muted-foreground">SOC 2 compliant with advanced security features built-in.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto"
                      onClick={() => setShowAuthFlow(true)}
                    >
                      Get Started
                      <ArrowRightIcon className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">
        <div className="border-b">
          <div className="container flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Settings</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="container p-4 md:p-8 mx-auto max-w-5xl space-y-8">
          <Tabs defaultValue="billing" className="space-y-8">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground relative w-full space-x-1">
              <TabsTrigger value="billing" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="api" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                <CodeBracketIcon className="mr-2 h-4 w-4" />
                API
              </TabsTrigger>
            </TabsList>

            {/* Billing Section */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your billing information, credits, and subscription tier.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Current Plan Banner */}
                  <div className="rounded-xl bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border border-blue-200 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-blue-900">Pay As You Go</h3>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Current Plan</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">$0.005 per credit • No monthly commitment</p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>

                  {/* Credit Balance & Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border bg-gradient-to-br from-white to-gray-50 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Available Credits</p>
                          <h3 className="text-3xl font-bold text-gray-900 mt-1">24,900</h3>
                          <p className="text-sm text-gray-500">≈ $12,450 USD</p>
                        </div>
                        <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add Credits
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Usage Rate</p>
                          <p className="text-lg font-semibold text-gray-900">1,240/day</p>
                          <p className="text-xs text-gray-500">↑ 12% from last week</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Est. Remaining</p>
                          <p className="text-lg font-semibold text-gray-900">20 days</p>
                          <p className="text-xs text-red-500">Low balance warning</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-gradient-to-br from-white to-gray-50 p-6">
                      <p className="text-sm font-medium text-gray-600">Usage Trends</p>
                      <div className="h-[120px] mt-2">
                        {/* Add your chart component here */}
                        <div className="w-full h-full bg-gradient-to-t from-blue-50 to-transparent rounded" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">This Week</p>
                          <p className="text-sm font-semibold text-gray-900">8,680 credits</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">This Month</p>
                          <p className="text-sm font-semibold text-gray-900">34,720 credits</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Avg. Cost/Day</p>
                          <p className="text-sm font-semibold text-gray-900">$6.20 USD</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Tiers */}
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
                          <SelectItem value="monthly">Monthly Billing</SelectItem>
                          <SelectItem value="annual">Annual Billing (20% off)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Basic Tier */}
                      <div className="rounded-xl border p-6 bg-white hover:border-blue-200 hover:shadow-lg transition-all flex flex-col min-h-[480px]">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">Pay As You Go</h4>
                          <p className="text-sm text-gray-500 mt-1">Perfect for testing and small projects</p>
                          <div className="mt-5">
                            <span className="text-3xl font-bold">$0.005</span>
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
                        <Button 
                          variant="outline" 
                          className="w-full h-11 mt-6 rounded-full font-medium"
                        >
                          Current Plan
                        </Button>
                      </div>

                      {/* Starter Tier */}
                      <div className="rounded-xl border p-6 bg-white hover:border-blue-200 hover:shadow-lg transition-all flex flex-col min-h-[480px]">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">Starter</h4>
                          <p className="text-sm text-gray-500 mt-1">For individuals and small teams</p>
                          <div className="mt-5">
                            <span className="text-3xl font-bold">${starterPrice.price}</span>
                            <span className="text-gray-500">{starterPrice.period}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{starterPrice.subtitle}</p>
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
                        <Button 
                          className="w-full h-11 mt-6 rounded-full font-medium bg-blue-600 hover:bg-blue-700"
                        >
                          Upgrade to Starter
                        </Button>
                      </div>

                      {/* Pro Tier */}
                      <div className="rounded-xl border p-6 bg-gradient-to-b from-blue-50 to-white relative hover:shadow-lg transition-all flex flex-col min-h-[480px]">
                        <div className="absolute -top-2 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          Most Popular
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">Pro</h4>
                          <p className="text-sm text-gray-500 mt-1">For growing teams and applications</p>
                          <div className="mt-5">
                            <span className="text-3xl font-bold">${proPrice.price}</span>
                            <span className="text-gray-500">{proPrice.period}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{proPrice.subtitle}</p>
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
                        <Button 
                          className="w-full h-11 mt-6 rounded-full font-medium bg-blue-600 hover:bg-blue-700"
                        >
                          Upgrade to Pro
                        </Button>
                      </div>

                      {/* Enterprise Tier */}
                      <div className="rounded-xl border p-6 bg-gradient-to-b from-purple-50 to-white hover:shadow-lg transition-all flex flex-col min-h-[480px]">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">Enterprise</h4>
                          <p className="text-sm text-gray-500 mt-1">For large-scale deployments</p>
                          <div className="mt-5">
                            <span className="text-3xl font-bold">Custom</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Volume-based pricing</p>
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
                        <Button 
                          variant="outline" 
                          className="w-full h-11 mt-6 rounded-full font-medium"
                        >
                          Contact Sales
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Payment Methods</Label>
                      <Button variant="outline" size="sm">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add New
                      </Button>
                    </div>
                    <div className="rounded-xl border p-6 bg-gray-50">
                      <p className="text-sm text-gray-500">
                        No payment methods added yet. Add a payment method to enable automatic credit top-ups and prevent service interruptions.
                      </p>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Transactions</h3>
                    <div className="rounded-xl border">
                      <div className="p-4 border-b bg-gray-50">
                        <div className="grid grid-cols-4 text-sm font-medium text-gray-500">
                          <div>Date</div>
                          <div>Description</div>
                          <div>Amount</div>
                          <div>Status</div>
                        </div>
                      </div>
                      <div className="divide-y">
                        <div className="p-4">
                          <div className="grid grid-cols-4 text-sm">
                            <div>Mar 15, 2024</div>
                            <div>Credit Purchase</div>
                            <div>10,000 credits</div>
                            <div className="flex items-center">
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                Completed
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-4 text-sm">
                            <div>Mar 1, 2024</div>
                            <div>Credit Purchase</div>
                            <div>25,000 credits</div>
                            <div className="flex items-center">
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                Completed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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
                    Securely manage your API keys for accessing Formation services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Production Key */}
                  <div className="rounded-xl border bg-white">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-base font-medium">Production API Key</Label>
                          <p className="text-sm text-gray-500">Use this key for your production environment</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Revoke
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
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
                          <p className="text-sm text-gray-500">Make your first API call using cURL:</p>
                          <div className="mt-2 relative rounded-lg bg-gray-900 p-4">
                            <code className="text-sm font-mono text-gray-200">
                              curl https://network.formation.cloud/v1/agents \<br/>
                              &nbsp;&nbsp;-H "Authorization: Bearer $YOUR_API_KEY" \<br/>
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
                          <Label className="text-base font-medium">Test API Key</Label>
                          <p className="text-sm text-gray-500">Use this key for testing and development</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Revoke
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
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
                          Never share your API keys in publicly accessible areas such as GitHub, client-side code, or support tickets. 
                          Need help? Check out our <Link href="/marketplace/settings/security" className="text-blue-600 hover:text-blue-700">security best practices</Link>.
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