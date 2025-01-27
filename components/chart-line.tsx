'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { CommentOverTimeQueryResult } from '@/lib/databrick';
// import { AuthProvider } from '@descope/react-sdk/flows';

const chartConfig = {
  today: {
    label: 'today',
    color: 'hsl(var(--chart-1))',
    icon: () => (
      <div
        className="w-4 h-4 m-2y bg-[hsl(var(--chart-1))]"
        style={{ borderRadius: '4px' }}
      />
    ),
  },
  expected: {
    label: 'expected',
    color: 'hsl(var(--chart-2))',
    icon: () => (
      <div
        className="w-4 h-4 my-2 bg-[hsl(var(--chart-2))]"
        style={{ borderRadius: '4px' }}
      />
    ),
  },
  time_bin: {
    label: 'time_bin',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ChartLine({
  todayMessagesAmount,
  expectedCommentsOverTime,
}: {
  todayMessagesAmount: CommentOverTimeQueryResult;
  expectedCommentsOverTime?: CommentOverTimeQueryResult;
}) {
  const chartData = todayMessagesAmount.map((item, index) => {
    return {
      time_bin: item.time_bin,
      today: item.cnt === 0 ? undefined : item.cnt,
      expected: expectedCommentsOverTime?.[index]?.cnt,
    };
  }) as { time_bin: string; today: number }[];

  const currentTime = chartData.reduce(
    // @ts-expect-error
    (acc, cur) => (cur.today > 0 ? cur : acc),
    0,
  ).time_bin;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-5xl">Comments Over Time</CardTitle>
        <CardDescription className="text-2xl">
          {format(new Date(), 'PP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              fontSize={28}
              label={{
                value: 'messages / mintue',
                style: { textAnchor: 'middle', fontSize: 30 },
                angle: -90,
                position: 'left',
                offset: 0,
              }}
              tickFormatter={(value) =>
                value.toLocaleString('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                })
              }
              vertAdvY={4}
              width={80}
            />
            <XAxis
              dataKey="time_bin"
              fontSize={24}
              interval={179}
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
              dataKey="expected"
              dot={false}
              stroke="var(--color-expected)"
              strokeDasharray="3 2"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="today"
              dot={false}
              stroke="var(--color-today)"
              strokeWidth={3}
              type="monotone"
            />
            <ReferenceLine
              stroke="red"
              strokeDasharray={3}
              x={currentTime ?? 0}
            />
            <ChartLegend
              className="absolute right-0 -top-16 text-4xl"
              content={<ChartLegendContent className="text-4xl" />}
              iconSize={40}
              verticalAlign="top"
              // layout="radial"
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
