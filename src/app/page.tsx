'use client';

import { Button } from '@/shared/ui/button';
import { BarChart3, Calendar, Target } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background-primary)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
                <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
                    Build Better Habits,
                    <br />
                    One Day at a Time
                </h1>
                <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-8">
                    Transform your daily routines into lasting habits with our intuitive tracking
                    system. Stay motivated, measure progress, and achieve your goals.
                </p>
                <Link href="/auth/sign-up">
                    <Button
                        size="lg"
                        className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]">
                        Start Tracking Now
                    </Button>
                </Link>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-[var(--background-surface)]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] text-center mb-12">
                        Everything You Need to Build Better Habits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-[var(--background-card)] rounded-xl shadow-md border border-[var(--border-primary)]">
                            <Calendar className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                Visual Calendar
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                Track your habits with an intuitive calendar view. See your progress
                                at a glance and stay motivated.
                            </p>
                        </div>
                        <div className="p-6 bg-[var(--background-card)] rounded-xl shadow-md border border-[var(--border-primary)]">
                            <Target className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                Goal Setting
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                Set clear goals and track your progress. Break down big goals into
                                manageable daily habits.
                            </p>
                        </div>
                        <div className="p-6 bg-[var(--background-card)] rounded-xl shadow-md border border-[var(--border-primary)]">
                            <BarChart3 className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                Progress Analytics
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                Get insights into your habits with detailed analytics. Monitor
                                streaks and completion rates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] text-center mb-12">
                        Why Choose Habbit?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center flex-shrink-0">
                                <div className="w-3 h-3 rounded-full bg-[var(--brand-primary)]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                    Simple and Intuitive
                                </h3>
                                <p className="text-[var(--text-secondary)]">
                                    Easy to use interface that helps you focus on what matters -
                                    building better habits.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center flex-shrink-0">
                                <div className="w-3 h-3 rounded-full bg-[var(--brand-primary)]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                    Stay Motivated
                                </h3>
                                <p className="text-[var(--text-secondary)]">
                                    Track your progress and celebrate your wins with visual progress
                                    indicators.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
