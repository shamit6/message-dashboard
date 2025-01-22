'use client';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ChartBar } from '@/components/chart-bar';
import { ChartLine } from '@/components/chart-line';
import type {
  CommentOverTimeQueryResult,
  SentimentChartQueryResult,
} from '@/lib/databrick';
import { fetch } from '@/lib/databrick';

export interface QueriesResult {
  totalMessageQueryResult: number;
  commentsOverTimeQueryResult: CommentOverTimeQueryResult;
  sentimentChartQueryResult: SentimentChartQueryResult;
  expectedCommentsOverTimeResult: CommentOverTimeQueryResult;
}

const fetchIntervalInSec: number = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL_IN_SEC ?? 30);

export default function ProductsPage() {
  const [querys, setQuerys] = useState<
    QueriesResult & { prevTotalMessage?: number }
  >({
    totalMessageQueryResult: 0,
    commentsOverTimeQueryResult: [],
    sentimentChartQueryResult: [],
    expectedCommentsOverTimeResult: [],
    prevTotalMessage: 0,
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetch().then(setQuerys);
    const interval = setInterval(() => {
      fetch().then((queriesResult) => {
        setLastUpdate(new Date());
        setQuerys((preResult) => ({
          ...queriesResult,
          prevTotalMessage: preResult.totalMessageQueryResult,
        }));
      });

      return () => {
        clearInterval(interval);
      };
    }, 1000 * fetchIntervalInSec);
  }, []);

  const {
    commentsOverTimeQueryResult,
    sentimentChartQueryResult,
    totalMessageQueryResult,
    expectedCommentsOverTimeResult,
    prevTotalMessage,
  } = querys;

  return (
    <Tabs defaultValue="all">
      <div className="text-8xl font-bold flex items-center justify-center h-48">
        <span>Today's Messages: </span>
        <CountUp
          duration={fetchIntervalInSec}
          end={totalMessageQueryResult}
          formattingFn={(value) => value.toLocaleString()}
          start={prevTotalMessage || totalMessageQueryResult}
          useEasing={false}

        >
          {({ countUpRef }) => (
            <span
              className="text-8xl font-bold flex items-center justify-center h-48 min-w-[5.5em]"
              ref={countUpRef}
            />
          )}
        </CountUp>
      </div>

      <TabsContent value="all">
        <div className="p-2">
          Last update at {formatInTimeZone(lastUpdate, 'UTC', 'HH:mm:ss')} UTC
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <ChartLine
            expectedCommentsOverTime={expectedCommentsOverTimeResult}
            todayMessagesAmount={commentsOverTimeQueryResult}
          />
          <ChartBar data={sentimentChartQueryResult} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
