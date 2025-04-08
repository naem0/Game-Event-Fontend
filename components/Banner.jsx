import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge";
import bannerImg from "../public/banner-img.jpg"
import React from 'react'

const Banner = () => {
    return (
        <section
            className="relative bg-cover bg-center bannre-section"
        >
            <div className='container mx-auto px-4 py-20 text-center'>
                <div className=" bg-opacity-50 absolute inset-0"></div>
                <div className="relative z-10">
                    <Badge variant="secondary" className="mb-4 text-lg">
                        GAMING EVENT
                    </Badge>
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Join the Big Tournament
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Compete with the best players worldwide and showcase your skills in our premier gaming championship.
                    </p>
                    <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-lg">
                        Register Now
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Banner
