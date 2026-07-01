import { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export const metadata: Metadata = {
  title: "Login - AuraMark OSM",
  description: "Sign in to your AuraMark account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-brand-bg">
      {/* Brand Section */}
      <div className="hidden md:flex flex-col justify-between bg-brand-primary p-10 text-white">
        <div className="flex items-center gap-2 font-bold text-2xl">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          AuraMark
        </div>
        
        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            The next generation of on-screen evaluation.
          </h1>
          <p className="text-lg text-blue-100">
            Streamline your marking process with AI-powered insights, intuitive workflows, and comprehensive analytics.
          </p>
        </div>

        <div className="text-sm text-blue-200">
          &copy; {new Date().getFullYear()} AuraMark Inc. All rights reserved.
        </div>
      </div>

      {/* Login Section */}
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center md:hidden mb-4">
            <div className="mx-auto h-12 w-12 rounded-lg bg-brand-primary flex items-center justify-center text-white mb-2">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-text-primary">
              AuraMark
            </h1>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-semibold tracking-tight text-brand-text-primary">
                Welcome back
              </CardTitle>
              <CardDescription className="text-brand-text-secondary">
                Enter your credentials to access your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none text-brand-text-primary" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="name@university.edu"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium leading-none text-brand-text-primary" htmlFor="password">
                        Password
                      </label>
                      <Link href="#" className="text-sm text-brand-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="password" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none text-brand-text-secondary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full mt-2">Sign In</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
