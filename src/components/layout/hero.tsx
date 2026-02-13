
"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImagesSlider } from "@/components/ui/images-slider"

export function Hero() {
    const images = [
        "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop",
    ];

    return (
        <ImagesSlider className="min-h-[90vh]" images={images}>
            <motion.div
                initial={{
                    opacity: 0,
                    y: -80,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.6,
                }}
                className="z-50 flex flex-col justify-center items-center text-center px-4"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center rounded-full border border-white/20 bg-black/30 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                        <span className="mr-2 flex h-2 w-2 rounded-full bg-emerald-500" />
                        v1.0 is now live
                    </div>
                </motion.div>

                <motion.h1
                    className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl mb-6"
                >
                    Craft layout <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                        in minutes.
                    </span>
                </motion.h1>

                <motion.p className="max-w-xl text-lg text-neutral-200 md:text-xl mb-10">
                    Build beautiful, responsive landing pages with our easy-to-use component library. Designed for speed (and comfort).
                </motion.p>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-0 gap-2 text-base">
                        Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm text-base">
                        Learn More
                    </Button>
                </div>
            </motion.div>
        </ImagesSlider>
    )
}
