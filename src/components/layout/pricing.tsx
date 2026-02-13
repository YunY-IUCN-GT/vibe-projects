"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

const plans = [
    {
        name: "Basic",
        description: "Perfect for individuals and small projects.",
        monthlyPrice: 9,
        yearlyPrice: 90,
        features: [
            "Up to 3 projects",
            "Basic analytics",
            "1 GB storage",
            "Email support",
            "Community access",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        description: "Best for growing teams and businesses.",
        monthlyPrice: 29,
        yearlyPrice: 290,
        features: [
            "Unlimited projects",
            "Advanced analytics",
            "50 GB storage",
            "Priority support",
            "Custom integrations",
            "Team collaboration",
            "API access",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        description: "For large organizations with advanced needs.",
        monthlyPrice: 99,
        yearlyPrice: 990,
        features: [
            "Everything in Pro",
            "Unlimited storage",
            "24/7 dedicated support",
            "Custom SLA",
            "SSO & SAML",
            "Audit logs",
            "Onboarding assistance",
        ],
        cta: "Contact Sales",
        popular: false,
    },
]

export function Pricing() {
    const [isYearly, setIsYearly] = React.useState(false)

    return (
        <section id="pricing" className="py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="mb-12 flex items-center justify-center gap-3">
                    <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                        Monthly
                    </span>
                    <Switch
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                    />
                    <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                        Yearly
                    </span>
                    {isYearly && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                        >
                            Save 20%
                        </motion.span>
                    )}
                </div>

                {/* Plan Cards */}
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={plan.popular ? "md:-mt-4 md:mb-[-16px]" : ""}
                        >
                            <Card
                                className={`relative h-full flex flex-col ${
                                    plan.popular
                                        ? "border-primary shadow-lg shadow-primary/10"
                                        : "border-muted"
                                }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    <CardDescription className="text-sm">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-1 flex-col gap-6">
                                    {/* Price */}
                                    <div className="text-center">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-4xl font-bold tracking-tight">
                                                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                /{isYearly ? "year" : "month"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="flex-1 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                <span className="text-sm text-muted-foreground">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? "default" : "outline"}
                                        size="lg"
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
