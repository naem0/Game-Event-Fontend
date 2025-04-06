import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import logo from "../public/logo.png";
import Image from "next/image";
import { Progress } from "@radix-ui/react-progress";

const MatchCard = ({ match }) => {
  return (
    <Card className="w-full max-w-md p-4 border border-gray-200 shadow-md rounded-lg bg-gray-600 text-white">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="">
            <Image
              src={logo}
              alt="Match Thumbnail"
              width={60}
              height={60}
              className="w-full object-cover rounded-lg mb-2"
            />
          </div>
          <div className="">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{match.title}</h2>
              <Badge variant="secondary">{match.id}</Badge>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{match.time}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-semibold">Total Prize</p>
            <p>৳{match.totalPrize}</p>
          </div>
          <div>
            <p className="font-semibold">Per Kill</p>
            <p>৳{match.perKill}</p>
          </div>
          <div>
            <p className="font-semibold">Entry Fee</p>
            <p>৳{match.entryFee}</p>
          </div>
          <div>
            <p className="font-semibold">Map</p>
            <p>{match.map}</p>
          </div>
        </div>

        <div className="mt-4">
          <Progress className="bg-white" value={33} />
          <p className="text-sm text-gray-400">33% Joined</p>
          <p className="text-sm text-gray-400">Join the match to compete and win prizes!</p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
            Join Now
          </Button>
          <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
            View Details
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Button variant="success">Watch Match</Button>
          <Button variant="outline">Not Joined</Button>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem title="Total Prize Details">
            <p className="text-sm text-gray-600">More details about the prize pool.</p>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default function MatchList() {
  const matches = [
    {
      id: "37545",
      title: "CS (4 VS 4) | Mobile",
      time: "27/03/2025 at 12:30 PM",
      totalPrize: 300,
      perKill: 0,
      entryFee: 50,
      map: "Bermuda",
    },
    {
      id: "37544",
      title: "CS (4 VS 4) | Mobile",
      time: "27/03/2025 at 12:30 PM",
      totalPrize: 300,
      perKill: 0,
      entryFee: 50,
      map: "Bermuda",
    },
  ];

  return (
    <div className=" grid grid-cols-1 md:grid-cols-3 items-center gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
