import { getMatchDetails } from '@/servises/getMatchDetails';
import React from 'react';

const page = async ({ params }) => {
  const { id } = params;
  const matchDetails = await getMatchDetails(id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Match Details</h1>

      {matchDetails ? (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={matchDetails.coverImage}
              alt="Match Cover"
              className="w-full md:w-1/2 h-64 object-cover rounded-xl"
            />
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">{matchDetails.title}</h2>
              <p className="text-gray-600">{matchDetails.description}</p>
              <div className="text-sm text-gray-500">
                <p><span className="font-semibold">Game:</span> {matchDetails.game}</p>
                <p><span className="font-semibold">Map:</span> {matchDetails.map}</p>
                <p><span className="font-semibold">Type:</span> {matchDetails.type}</p>
                <p><span className="font-semibold">Version:</span> {matchDetails.version}</p>
                <p><span className="font-semibold">Device:</span> {matchDetails.device}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-sm md:text-base">
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-bold text-green-600 text-xl">{matchDetails.entryFee}৳</p>
              <p className="text-gray-500">Entry Fee</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-bold text-green-600 text-xl">{matchDetails.winningPrize}৳</p>
              <p className="text-gray-500">Winning Prize</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-bold text-green-600 text-xl">{matchDetails.perKillPrize}৳</p>
              <p className="text-gray-500">Per Kill</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-bold text-green-600 text-xl">{matchDetails.maxPlayers}</p>
              <p className="text-gray-500">Max Players</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-bold text-green-600 text-xl">{matchDetails.playersRegistered}</p>
              <p className="text-gray-500">Registered</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="font-bold text-green-600 text-xl">
                {new Date(matchDetails.matchSchedule).toLocaleString()}
              </p>
              <p className="text-gray-500">Match Schedule</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Rules</h3>
            <p className="text-gray-600 whitespace-pre-line">{matchDetails.rules}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No match details available.</p>
      )}
    </div>
  );
};

export default page;
