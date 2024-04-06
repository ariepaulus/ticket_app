'use client';

import { Status } from '@prisma/client';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface dataElements {
  name: Status;
  total: number;
}

interface dataProps {
  data: dataElements[];
}

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const DashChart = ({ data }: dataProps) => {
  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>Ticket Counts</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={data}>
            <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
            <Bar dataKey='total' fill='#60A5FA' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashChart;
