"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    Monitor,
    Smartphone,
    Zap,
    Search,
    Accessibility,
    Moon,
    type LucideIcon,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

const iconMap: Record<string, LucideIcon> = {
    Smartphone,
    Monitor,
    Zap,
    Search,
    Accessibility,
    Moon,
}

const defaultFeatures = [
    {
        title: "Responsive Design",
        description: "Layouts that adapt seamlessly to any screen size, from desktop to mobile.",
        icon: "Smartphone",
    },
    {
        title: "Modern UI",
        description: "Built with the latest design trends and components for a premium look.",
        icon: "Monitor",
    },
    {
        title: "Fast Performance",
        description: "Optimized for speed with lightweight code and efficient rendering.",
        icon: "Zap",
    },
    {
        title: "SEO Optimized",
        description: "Structure and tags designed to help your site rank better in search results.",
        icon: "Search",
    },
    {
        title: "Accessibility",
        description: "Adheres to WAI-ARIA standards to ensure your site is usable by everyone.",
        icon: "Accessibility",
    },
    {
        title: "Dark Mode",
        description: "Built-in support for dark mode to reduce eye strain and save battery.",
        icon: "Moon",
    },
]

export function Features() {
    const [features, setFeatures] = useState(defaultFeatures)

    useEffect(() => {
        const fetchContent = async () => {
            const { data: content } = await supabase
                .from('site_content')
                .select('content_value')
                .eq('section', 'features')
                .eq('content_key', 'list')
                .single()

            if (content?.content_value) {
                const val = content.content_value as { items?: typeof defaultFeatures }
                if (val.items && val.items.length > 0) {
                    setFeatures(val.items)
                }
            }
        }
        fetchContent()
    }, [])

    return (
        <section id="features" className="container mx-auto px-4 py-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Key Features
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Everything you need to build high-quality landing pages.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
                    const Icon = iconMap[feature.icon] ?? Zap
                    return (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card className="h-full border-muted bg-card/50 transition-colors hover:border-primary/50 hover:shadow-lg">
                                <CardHeader>
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}
