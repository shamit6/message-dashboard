'use client';

import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
// import { AuthProvider } from '@descope/react-sdk/flows';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  cnt: {
    label: 'cnt',
    color: 'hsl(var(--chart-1))',
  },
  time_bin: {
    label: 'time_bin',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ChartLine({ data }: { data: any }) {
  const chartData = data.map((item: any) => {
    return {
      time_bin: item.time_bin,
      cnt: item.cnt === 0 ? undefined : item.cnt,
    };
  });

  console.log('linechartdata', { chartData, chartConfig });
  // @ts-expect-error find max time with cnt
  const currentTime = chartData.reduce(
    (acc, cur) => (cur.cnt > 0 ? cur : acc),
    0,
  ).time_bin;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData ?? []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis />
            <XAxis
              axisLine={false}
              dataKey="time_bin"
              interval={35}
              tickFormatter={(value) => value.slice(11, 16)}
              tickLine={false}
              tickMargin={8}
              tickSize={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent labelKey="ss" />}
              cursor={false}
            />
            <Line
              dataKey="cnt"
              dot={false}
              stroke="var(--color-cnt)"
              strokeWidth={2}
              type="monotone"
            />
            <ReferenceLine
              stroke="red"
              strokeDasharray={3}
              x={currentTime ?? 0}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
