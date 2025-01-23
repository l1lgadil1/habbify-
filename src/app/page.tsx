'use client';

import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { Calendar, Target, BarChart2, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 md:pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
              Build Better Habits, One Day at a Time
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Transform your daily routines into lasting habits with our intuitive tracking system.
              Stay motivated, measure progress, and achieve your goals.
            </p>
            <Button 
              size="lg" 
              className="h-12 px-8 text-lg"
              onClick={() => router.push('/dashboard')}
            >
              Start Tracking Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-48 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything You Need to Build Better Habits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Calendar</h3>
            <p className="text-muted-foreground">
              Track your habits with an intuitive calendar view. See your progress at a glance and stay motivated.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Goal Setting</h3>
            <p className="text-muted-foreground">
              Set clear goals and track your progress. Break down big goals into manageable daily habits.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
            <p className="text-muted-foreground">
              Get insights into your habits with detailed analytics. Monitor streaks and completion rates.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Habbit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Simple and Intuitive</h3>
                <p className="text-muted-foreground">
                  Our clean and user-friendly interface makes habit tracking effortless. No complicated setup required.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Stay Motivated</h3>
                <p className="text-muted-foreground">
                  Visual progress tracking and achievement celebrations keep you motivated on your journey.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Flexible Tracking</h3>
                <p className="text-muted-foreground">
                  Track daily, weekly, or custom frequency habits. Adapt the system to your unique needs.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Insights</h3>
                <p className="text-muted-foreground">
                  Get valuable insights into your habits with detailed statistics and progress reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who are already building better habits and achieving their goals.
            Start your journey today!
          </p>
          <Button 
            size="lg" 
            className="h-12 px-8 text-lg"
            onClick={() => router.push('/dashboard')}
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
