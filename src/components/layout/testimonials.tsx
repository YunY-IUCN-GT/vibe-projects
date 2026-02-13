
"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
    {
        name: "Alex Johnson",
        title: "CTO",
        company: "TechFlow",
        review:
            "This library has saved us hundreds of hours of development time. The components are top-notch and easy to customize.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
        initials: "AJ",
    },
    {
        name: "Sarah Williams",
        title: "Product Designer",
        company: "Creative Studio",
        review:
            "The attention to detail in the design is incredible. It looks premium right out of the box and fits our brand perfectly.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
        initials: "SW",
    },
    {
        name: "Michael Brown",
        title: "Frontend Developer",
        company: "StartUp Inc",
        review:
            "Documentation is clear, and the code is clean. It's rare to find a library that balances flexibility and ease of use so well.",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=faces",
        initials: "MB",
    },
    {
        name: "Emily Davis",
        title: "Marketing Director",
        company: "Growth Labs",
        review:
            "Our conversion rates increased by 20% after redesigning our landing page with these components. Highly recommended!",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
        initials: "ED",
    },
    {
        name: "David Wilson",
        title: "Founder",
        company: "NextGen Apps",
        review:
            "I was able to launch my MVP in a weekend thanks to this kit. It has everything you need to build a professional website.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        initials: "DW",
    },
]

export function Testimonials() {
    const [api, setApi] = React.useState<any>()

    return (
        <section id="testimonials" className="bg-muted/30 py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        What Our Users Say
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Trusted by developers and designers from top companies.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <Carousel
                        setApi={setApi}
                        plugins={[
                            Autoplay({
                                delay: 4000,
                            }),
                        ]}
                        className="w-full"
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        onMouseEnter={() => api?.plugins().autoplay.stop()}
                        onMouseLeave={() => api?.plugins().autoplay.play()}
                    >
                        <CarouselContent className="-ml-4">
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Card className="h-full border-muted bg-background shadow-sm transition-all hover:shadow-md">
                                            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                                                <Avatar className="h-12 w-12 border">
                                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold leading-none">
                                                        {testimonial.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {testimonial.title} @{testimonial.company}
                                                    </p>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground italic">
                                                    "{testimonial.review}"
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 opacity-50 hover:opacity-100" />
                        <CarouselNext className="hidden md:flex -right-12 opacity-50 hover:opacity-100" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
