import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Candidate } from '../../../shared/types';
import { BarChart3 } from 'lucide-react';

interface ElectionChartsProps {
  candidates: Candidate[];
}

export const ElectionCharts: React.FC<ElectionChartsProps> = ({ candidates }) => {
  const chartData = candidates.map(candidate => ({
    name: candidate.name.split(' ')[0],
    votes: candidate.voteCount,
    fullName: candidate.name
  }));

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const pieData = candidates.map((candidate, index) => ({
    name: candidate.name,
    value: candidate.voteCount,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Vote Count</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelFormatter={(label) => chartData.find(d => d.name === label)?.fullName || label}
              />
              <Bar dataKey="votes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Vote Distribution</h3>
        <div className="h-64 md:h-80">
          {totalVotes > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={12}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">No votes yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};