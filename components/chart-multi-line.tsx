'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
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
import type { SentimentOverTimeQueryResult } from '@/lib/databrick';

// const chartData = [
//   { month: 'January', desktop: 186, mobile: 80 },
//   { month: 'February', desktop: 305, mobile: 200 },
//   { month: 'March', desktop: 237, mobile: 120 },
//   { month: 'April', desktop: 73, mobile: 190 },
//   { month: 'May', desktop: 209, mobile: 130 },
//   { month: 'June', desktop: 214, mobile: 140 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig

const chartConfig = {
  // cnt: {
  //   label: 'cnt',
  // },
  unsubstantial: {
    label: 'unsubstantial',
    color: 'hsl(var(--chart-1))',
  },
  likely_to_reject: {
    label: 'likely_to_reject',
    color: 'hsl(var(--chart-2))',
  },
  incoherent: {
    label: 'incoherent',
    color: 'hsl(var(--chart-3))',
  },
  attack_on_commenter: {
    label: 'attack_on_commenter',
    color: 'hsl(var(--chart-4))',
  },
  affinity_experimental: {
    label: 'affinity_experimental',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function ChartMultiLine({
  data,
}: {
  data: SentimentOverTimeQueryResult;
}) {
  const chartData = Object.values(
    data.reduce(
      (
        acc: Record<string, Record<string, Date | number>>,
        item: (typeof data)[0],
      ) => {
        const dateString = new Date(item.written_date).toString();
        if (!acc[dateString]) {
          acc[dateString] = {
            written_date: item.written_date,
          };
        }
        acc[dateString][item.sentiment] = item.cnt;
        return acc;
      },
      {},
    ),
  );

  // map((item: any) => {
  //   return {
  //     written_date: item.written_date.to,
  //     [item.sentiment]: item.cnt,
  //   }
  // })

  console.log({ chartData });
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
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="written_date"
              tickCount={16}
              tickFormatter={(value) => new Date(value).getHours().toString()}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Line
              dataKey="unsubstantial"
              dot={false}
              stroke="var(--color-unsubstantial)"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="likely_to_reject"
              dot={false}
              stroke="var(--color-likely_to_reject)"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="incoherent"
              dot={false}
              stroke="var(--color-incoherent)"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="attack_on_commenter"
              dot={false}
              stroke="var(--color-attack_on_commenter)"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="affinity_experimental"
              dot={false}
              stroke="var(--color-affinity_experimental)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
