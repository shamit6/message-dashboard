'use client';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ChartBar } from '@/components/chart-bar';
import { ChartLine } from '@/components/chart-line';
import type {
  CommentOverTimeQueryResult,
  SentimentChartQueryResult,
} from '@/lib/databrick';
import { fetch } from '@/lib/databrick';

export default function ProductsPage() {
  const [querys, setQuerys] = useState<{
    totalMessageQueryResult: number;
    commentsOverTimeQueryResult: CommentOverTimeQueryResult;
    sentimentChartQueryResult: SentimentChartQueryResult;
    expectedCommentsOverTimeResult: CommentOverTimeQueryResult;
  }>({
    totalMessageQueryResult: 0,
    commentsOverTimeQueryResult: [],
    sentimentChartQueryResult: [],
    expectedCommentsOverTimeResult: [],
  });

  useEffect(() => {
    fetch().then(setQuerys);
    const interval = setInterval(() => {
      fetch().then(setQuerys);
      return () => {
        clearInterval(interval);
      };
    }, 5000);
  }, []);
  const {
    commentsOverTimeQueryResult,
    sentimentChartQueryResult,
    totalMessageQueryResult,
    expectedCommentsOverTimeResult,
  } = querys;

  return (
    <Tabs defaultValue="all">
      <span className="text-4xl font-bold text-center flex items-center justify-center h-48">
        Today's Messages {totalMessageQueryResult.toLocaleString()}
      </span>
      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <ChartLine
            expectedCommentsOverTime={expectedCommentsOverTimeResult}
            todayMessagesAmount={commentsOverTimeQueryResult}
          />
          <ChartBar data={sentimentChartQueryResult} />
          {/* <ChartMultiLine data={sentimentOverTimeQueryResult} /> */}
        </div>
      </TabsContent>
    </Tabs>
  );
}
