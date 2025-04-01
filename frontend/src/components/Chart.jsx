import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', value: 10 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 50 },
  { name: 'Thu', value: 38 },
  { name: 'Fri', value: 45 },
];

const Chart = () => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Today Trends</h2>
      <LineChart width={400} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default Chart;
