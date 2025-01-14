import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ChartBar } from '@/components/chart-bar';
import { ChartLine } from '@/components/chart-line';
import { ChartMultiLine } from '@/components/chart-multi-line';
import { fetch } from '@/lib/databrick';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';

export default async function ProductsPage() {
  const {
    lineChartQueryResult,
    sentimentChartQueryResult,
    // sentimentOverTimeQueryResult,
    totalMessageQueryResult,
  } = await fetch();

  return (
    <Tabs defaultValue="all">
      <span className="text-4xl font-bold text-center flex items-center justify-center h-48">
        Today's Messages {totalMessageQueryResult.toLocaleString()}
      </span>
      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <ChartLine data={lineChartQueryResult} />
          <ChartBar data={sentimentChartQueryResult} />
          {/* <ChartMultiLine data={sentimentOverTimeQueryResult} /> */}
        </div>
      </TabsContent>
    </Tabs>
  );
}
