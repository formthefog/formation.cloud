import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRightIcon,
  CodeBracketIcon,
  CreditCardIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth-provider";
export default function SplashComponent({
  setShowAuthFlow,
}: {
  setShowAuthFlow: (show: boolean) => void;
}) {
  const { loading } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">
        <div className="border-b">
          <div className="container flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold">Get Started</h1>
          </div>
        </div>

        <div className="container p-4 md:p-8 mx-auto max-w-7xl">
          <div className="max-w-2xl mx-auto">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" />
              <CardHeader className="relative">
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                  <SparklesIcon className="w-8 h-8 text-blue-500" />
                  Welcome to Formation
                </CardTitle>
                <CardDescription className="text-base">
                  Sign in to access your API keys, manage billing, and deploy AI
                  agents.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                    <RocketLaunchIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Quick Deployment</h3>
                      <p className="text-sm text-muted-foreground">
                        Deploy AI agents in under 60 seconds with our
                        streamlined process.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                    <CodeBracketIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">API Access</h3>
                      <p className="text-sm text-muted-foreground">
                        Get instant access to our API and start integrating AI
                        capabilities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                    <CreditCardIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Simple Billing</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay-per-use pricing with no hidden fees or long-term
                        commitments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-blue-100">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Enterprise Ready</h3>
                      <p className="text-sm text-muted-foreground">
                        SOC 2 compliant with advanced security features
                        built-in.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    size="lg"
                    className="w-full md:w-auto"
                    onClick={() => setShowAuthFlow(true)}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Get Started"}
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
