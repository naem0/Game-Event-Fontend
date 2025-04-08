import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Events = () => {
    return (
        <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                {/* League of Legends Card */}
                <Card className="border-gray-800 bg-gray-900 pt-0 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDKvl8fwmwJyf2jhGmLTYho5WA0KD8mOnPpA&s"
                            alt="League of Legends"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl text-pink-500">League of Legends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-300 mb-4">Lor separat existentie es un myth. Por scientie, musica, sport etc.</p>
                        <ul className="space-y-3 text-gray-300 flex justify-between items-center">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                Multiphyser
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                5 Day
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                $150.00
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Call of Duty Card */}
                <Card className="border-gray-800 bg-gray-900 pt-0 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDKvl8fwmwJyf2jhGmLTYho5WA0KD8mOnPpA&s"
                            alt="Call of Duty"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl text-purple-500">Call of Duty Series</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-300 mb-4">Lor separat existentie es un myth. Por scientie, musica, sport etc.</p>
                        <ul className="space-y-3 text-gray-300 flex justify-between items-center">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                Multiphyser
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                5 Day
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                $150.00
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* World of Warcraft Card */}
                <Card className="border-gray-800 bg-gray-900 pt-0 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDKvl8fwmwJyf2jhGmLTYho5WA0KD8mOnPpA&s"
                            alt="World of Warcraft"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl text-blue-500">World of Warcraft</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-300 mb-4">Lor separat existentie es un myth. Por scientie, musica, sport etc.</p>
                        <ul className="space-y-3 text-gray-300 flex justify-between items-center">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                Multiphyser
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                5 Day
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                $150.00
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default Events
