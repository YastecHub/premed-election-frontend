import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Candidate } from '../../../shared/types';
import { BarChart3 } from 'lucide-react';

interface ElectionChartsProps {
  candidates: Candidate[];
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export const ElectionCharts: React.FC<ElectionChartsProps> = ({ candidates }) => {
  const chartData = candidates.map(candidate => ({
    name: candidate.name.split(' ')[0],
    votes: candidate.voteCount,
    fullName: candidate.name
  }));

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  const pieData = candidates.map((candidate, index) => ({
    name: candidate.name,
    value: candidate.voteCount,
    color: COLORS[index % COLORS.length]
  }));

  const tooltipStyle = {
    backgroundColor: '#18181b',
    border: '1px solid rgba(63,63,70,0.5)',
    borderRadius: '12px',
    color: '#f4f4f5',
    fontSize: '12px',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
      {/* Bar Chart */}
      <div className="bento-card p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4">Vote Count</h3>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.5)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={11}
                angle={-40}
                textAnchor="end"
                height={55}
                tick={{ fill: '#71717a' }}
              />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tick={{ fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: 'rgba(139,92,246,0.08)' }}
                labelFormatter={(label) => chartData.find(d => d.name === label)?.fullName || label}
              />
              <Bar dataKey="votes" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bento-card p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4">Vote Distribution</h3>
        <div className="h-64 sm:h-72">
          {totalVotes > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={11}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">No votes yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
