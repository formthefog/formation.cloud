'use client';

import { useState } from 'react';
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
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const { setShowAuthFlow, handleLogOut } = useDynamicContext();

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
                    Manage your billing information and credit balance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Balance</p>
                        <h3 className="text-2xl font-bold">24,900 Credits</h3>
                        <p className="text-sm text-muted-foreground">≈ $12,450 USD</p>
                      </div>
                      <Button>Buy Credits</Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <Label>Payment Methods</Label>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">
                        No payment methods added yet.
                      </p>
                      <Button variant="outline" className="mt-4">
                        Add Payment Method
                      </Button>
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
                    Manage your API keys for accessing Formation services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Production API Key</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="password"
                              value="sk_live_xxxxxxxxxxxxx"
                              readOnly
                            />
                            <Button variant="outline">Copy</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Test API Key</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="password"
                              value="sk_test_xxxxxxxxxxxxx"
                              readOnly
                            />
                            <Button variant="outline">Copy</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Generate New API Key</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 