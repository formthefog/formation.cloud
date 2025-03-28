'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  KeyIcon,
  GlobeAltIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">
        <div className="border-b">
          <div className="container flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
        </div>

        <div className="container p-4 md:p-8 mx-auto max-w-5xl space-y-8">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground relative w-full space-x-1">
              <TabsTrigger value="profile" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                <ShieldCheckIcon className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="billing" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="api" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                <CodeBracketIcon className="mr-2 h-4 w-4" />
                API
              </TabsTrigger>
            </TabsList>

            {/* Profile Section */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and public presence.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button>Change Avatar</Button>
                      <p className="text-sm text-muted-foreground">
                        JPG, GIF or PNG. Max size 2MB.
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="johndoe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" type="url" placeholder="https://yourwebsite.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notifications Section */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Agent Activity</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your agents' performance and usage.
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Earnings Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about your earnings and payouts.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive news about Formation features and updates.
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Section */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your security preferences and authentication methods.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div>
                      <Label>Active Sessions</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Current Session</p>
                            <p className="text-xs text-muted-foreground">
                              Last active: Just now
                            </p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset Password</Button>
                  <Button variant="destructive">Sign Out All Devices</Button>
                </CardFooter>
              </Card>
            </TabsContent>

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