import { Button } from "@/components/ui/button";
import Events from "./Events";
import Banner from "./Banner";
import MatchList from "./MatchList";

export default function GamingEventPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#15161A] to-gray-900 text-white">
            {/* Hero Section */}
            <Banner/>

            {/* Events Section */}
            <Events/>
        <div className="container mx-auto px-4 py-16">
            <MatchList/>
        </div>

            {/* Stats Section */}
            <section className="container mx-auto px-4 py-16 bg-gray-800 rounded-xl">
                <h2 className="text-3xl font-bold text-center mb-12">Our History Achievement</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-5xl font-bold text-pink-500">S/4+</p>
                        <p className="text-gray-400">Top Tier Events</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold text-purple-500">230+</p>
                        <p className="text-gray-400">Professional Players</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold text-blue-500">5.5K+</p>
                        <p className="text-gray-400">Community Members</p>
                    </div>
                </div>
            </section>

            {/* Tournament Info */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-8">Historical Tournaments Ever</h2>
                <div className="bg-gray-900 rounded-lg p-6 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-4 text-pink-500">How It Work Tournament</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-700">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-gray-700">
                                    <td className="px-6 py-4">Did not Begin for the Tournament</td>
                                    <td className="px-6 py-4">Check the Body and Discontinents</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-4xl font-bold mb-6">Join the Tournament Here</h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Show Your Skills in the Tournament Later and compete for glory!
                </p>
                <div className="flex gap-4 justify-center">
                    <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-lg">
                        Register Now
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-gray-800 text-lg">
                        Learn More
                    </Button>
                </div>
            </section>
        </div>
    );
}