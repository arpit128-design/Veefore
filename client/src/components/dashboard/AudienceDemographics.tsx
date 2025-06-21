import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MapPin, Activity } from 'lucide-react';

// Mock data for testing purposes
const mockDemographics = {
  ageGroups: {
    '18-24': 28,
    '25-34': 42,
    '35-44': 18,
    '45-54': 8,
    '55+': 4
  },
  gender: {
    female: 64,
    male: 34,
    other: 2
  }
};

const mockLocations = {
  countries: [
    { name: 'India', percentage: 45 },
    { name: 'United States', percentage: 18 },
    { name: 'United Kingdom', percentage: 12 },
    { name: 'Canada', percentage: 8 },
    { name: 'Australia', percentage: 6 },
    { name: 'Others', percentage: 11 }
  ],
  cities: [
    { name: 'Mumbai', percentage: 22 },
    { name: 'Delhi', percentage: 18 },
    { name: 'Bangalore', percentage: 15 },
    { name: 'New York', percentage: 12 },
    { name: 'London', percentage: 8 }
  ]
};

const mockActivity = {
  bestTimes: [
    { time: '9:00 AM', engagement: 85 },
    { time: '12:00 PM', engagement: 92 },
    { time: '6:00 PM', engagement: 96 },
    { time: '9:00 PM', engagement: 88 }
  ],
  weeklyActivity: {
    Monday: 78,
    Tuesday: 82,
    Wednesday: 85,
    Thursday: 88,
    Friday: 92,
    Saturday: 96,
    Sunday: 89
  }
};

export function AudienceDemographics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Demographics */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-violet-400 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Audience Demographics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Age Groups */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Age Distribution</h4>
            <div className="space-y-2">
              {Object.entries(mockDemographics.ageGroups).map(([age, percentage]) => (
                <div key={age} className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{age} years</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-400 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-violet-400 font-semibold w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Distribution */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Gender Distribution</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <div className="text-xl font-bold text-violet-400">
                  {mockDemographics.gender.female}%
                </div>
                <div className="text-xs text-gray-400">Female</div>
              </div>
              <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <div className="text-xl font-bold text-violet-400">
                  {mockDemographics.gender.male}%
                </div>
                <div className="text-xs text-gray-400">Male</div>
              </div>
              <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <div className="text-xl font-bold text-violet-400">
                  {mockDemographics.gender.other}%
                </div>
                <div className="text-xs text-gray-400">Other</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Top Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Countries</h4>
            <div className="space-y-2">
              {mockLocations.countries.map((country, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-gray-300">{country.name}</span>
                  <span className="text-sm text-blue-400 font-semibold">{country.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Top Cities</h4>
            <div className="space-y-2">
              {mockLocations.cities.map((city, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                  <span className="text-sm text-gray-300">{city.name}</span>
                  <span className="text-sm text-blue-400 font-semibold">{city.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Audience Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Best Times */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Best Times to Post</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockActivity.bestTimes.map((time, index) => (
                <div key={index} className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-lg font-bold text-green-400">{time.time}</div>
                  <div className="text-xs text-gray-400">{time.engagement}% engagement</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Weekly Activity Pattern</h4>
            <div className="space-y-2">
              {Object.entries(mockActivity.weeklyActivity).map(([day, activity]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 w-20">{day}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400 rounded-full" 
                        style={{ width: `${activity}%` }}
                      />
                    </div>
                    <span className="text-sm text-green-400 font-semibold w-10">{activity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}