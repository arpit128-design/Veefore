import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockAgeData = [
  { age: '18-24', percentage: 23, count: 1250 },
  { age: '25-34', percentage: 35, count: 1890 },
  { age: '35-44', percentage: 28, count: 1512 },
  { age: '45-54', percentage: 10, count: 540 },
  { age: '55+', percentage: 4, count: 216 }
];

const mockGenderData = [
  { gender: 'Female', percentage: 58, count: 3134, color: '#ff6b9d' },
  { gender: 'Male', percentage: 40, count: 2160, color: '#4ecdc4' },
  { gender: 'Other', percentage: 2, count: 108, color: '#ffe66d' }
];

const mockLocationData = [
  { country: 'United States', percentage: 35, count: 1890 },
  { country: 'India', percentage: 18, count: 972 },
  { country: 'United Kingdom', percentage: 12, count: 648 },
  { country: 'Canada', percentage: 8, count: 432 },
  { country: 'Australia', percentage: 6, count: 324 },
  { country: 'Germany', percentage: 5, count: 270 },
  { country: 'Others', percentage: 16, count: 864 }
];

const mockActivityData = [
  { time: '6 AM', engagement: 12 },
  { time: '9 AM', engagement: 28 },
  { time: '12 PM', engagement: 45 },
  { time: '3 PM', engagement: 67 },
  { time: '6 PM', engagement: 89 },
  { time: '9 PM', engagement: 95 },
  { time: '12 AM', engagement: 34 }
];

export default function AudienceDemographics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Age Demographics */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Age Demographics</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Age distribution of your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockAgeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="percentage" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gender Demographics */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Gender Distribution</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Gender breakdown of your followers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockGenderData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="percentage"
              >
                {mockGenderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {mockGenderData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-400">{item.gender}: {item.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Locations */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Top Locations</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Geographic distribution of your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLocationData.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-white">{location.country}</span>
                  <span className="text-xs text-gray-400">({location.count.toLocaleString()})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-8">{location.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Times */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Peak Activity Times</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            When your audience is most active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="engagement" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}