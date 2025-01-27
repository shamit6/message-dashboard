'use server';

import { DBSQLClient } from '@databricks/sql';
import type IDBSQLClient from '@databricks/sql/dist/contracts/IDBSQLClient';
import type IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession';
import { isBefore, startOfToday } from 'date-fns';

const serverHostname = process.env.DATABRICKS_SERVER_HOSTNAME!;
const httpPath = process.env.DATABRICKS_HTTP_PATH!;
const token = process.env.DATABRICKS_TOKEN!;

if (token == '' || serverHostname == '' || httpPath == '') {
  throw new Error(
    'Cannot find Server Hostname, HTTP Path, or personal access token. ' +
      'Check the environment variables DATABRICKS_SERVER_HOSTNAME, ' +
      'DATABRICKS_HTTP_PATH, and DATABRICKS_TOKEN.',
  );
}

const client = new DBSQLClient();
const connectOptions = {
  token,
  host: serverHostname,
  path: httpPath,
};

export type CommentOverTimeQueryResult = { time_bin: string; cnt: number }[];
export type SentimentChartQueryResult = { sentiment: string; cnt: number }[];
export type SentimentOverTimeQueryResult = {
  written_date: Date;
  sentiment: string;
  cnt: number;
}[];

let connectedClient: IDBSQLClient | null = null;

function ensureConnectDataBricksSQL() {
  if (connectedClient) {
    return connectedClient;
  }
  console.log('Connecting to Databricks SQL...', connectOptions);
  return client
    .connect(connectOptions)
    .then((client: IDBSQLClient) => {
      connectedClient = client;
      return client;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

let currentToday: Date;
let currentExpectedCommentsOverTimeResult: CommentOverTimeQueryResult;

export async function fetch(): Promise<{
  totalMessageQueryResult: number;
  commentsOverTimeQueryResult: CommentOverTimeQueryResult;
  sentimentChartQueryResult: SentimentChartQueryResult;
  expectedCommentsOverTimeResult: CommentOverTimeQueryResult;
}> {
  await ensureConnectDataBricksSQL();
  try {
    const session = await connectedClient!.openSession();
    const today = startOfToday();
    today.setHours(0, 5, 0, 0);
    let expectedCommentsOverTimePromise: Promise<CommentOverTimeQueryResult>;

    if (!currentToday || isBefore(today, currentToday)) {
      currentToday = today;
      expectedCommentsOverTimePromise = expectedMessagesByInterval(
        session,
      ) as Promise<CommentOverTimeQueryResult>;
    } else {
      expectedCommentsOverTimePromise = Promise.resolve(
        currentExpectedCommentsOverTimeResult,
      );
    }

    const [
      totalMessageQueryResult,
      commentsOverTimeQueryResult,
      sentimentChartQueryResult,
      expectedCommentsOverTimeResult,
    ] = await Promise.all([
      totalMessageQuery(session),
      CommentsOverTimeQuery(session),
      sentimentChartQuery(session),
      expectedCommentsOverTimePromise,
    ]);

    currentExpectedCommentsOverTimeResult = expectedCommentsOverTimeResult;
    await session.close();

    return {
      totalMessageQueryResult,
      commentsOverTimeQueryResult,
      sentimentChartQueryResult,
      expectedCommentsOverTimeResult,
    };
  } catch (error) {
    console.error(error);
    return {
      totalMessageQueryResult: 0,
      commentsOverTimeQueryResult: [],
      sentimentChartQueryResult: [],
      expectedCommentsOverTimeResult: [],
    };
  }
}

async function totalMessageQuery(session: IDBSQLSession) {
  const result = await query(
    session,
    'SELECT COUNT(*) AS total_messages FROM data_catalog_dev.default.unique_messages_v2 WHERE DATE(written_date) = CURRENT_DATE()',
  );

  // @ts-expect-error
  return result[0].total_messages as number;
}

async function CommentsOverTimeQuery(session: IDBSQLSession) {
  return query(
    session,
    `WITH time_bins AS (
    SELECT
        from_unixtime(UNIX_TIMESTAMP(CURRENT_DATE) + (s.id * 60)) AS time_bin
    FROM (
        SELECT EXPLODE(SEQUENCE(0, 24 * 60 - 1)) AS id -- 24 hours, 60 minutes
    ) s
),
ranked_bins AS (
    SELECT
        from_unixtime(floor(unix_timestamp(written_at) / 60) * 60) AS time_bin,
        COUNT(*) AS cnt,
        ROW_NUMBER() OVER (ORDER BY from_unixtime(floor(unix_timestamp(written_at) / 60) * 60) DESC) AS rank
    FROM
        data_catalog_dev.default.unique_messages_v2
    WHERE
        DATE(written_date) = CURRENT_DATE()
    GROUP BY
        from_unixtime(floor(unix_timestamp(written_at) / 60) * 60)
),
filtered_bins AS (
    SELECT
        time_bin,
        cnt,
        CASE WHEN rank = 2 THEN cnt ELSE NULL END AS latest_status
    FROM
        ranked_bins
    WHERE
        rank > 1
)
SELECT
    tb.time_bin,
    COALESCE(fb.cnt, NULL) AS cnt,
    fb.latest_status AS latest_bin
FROM
    time_bins tb
LEFT JOIN
    filtered_bins fb
ON
    tb.time_bin = fb.time_bin
ORDER BY
    tb.time_bin;`,
  ) as Promise<CommentOverTimeQueryResult>;
}

async function sentimentChartQuery(session: IDBSQLSession) {
  return query(
    session,
    `SELECT
        sentiment,
        COUNT(*) AS cnt
    FROM
        data_catalog_dev.default.unique_messages_v2
    WHERE
        DATE(written_date) = CURRENT_DATE() and sentiment IS NOT NULL
    GROUP BY
        sentiment
    ORDER BY cnt DESC
    LIMIT 5`,
  ) as Promise<SentimentChartQueryResult>;
}

// async function sentimentOverTimeQuery(session: IDBSQLSession) {
//   return query(
//     session,
//     `WITH AggregatedMessages AS (
//       SELECT
//         written_date,
//         sentiment,
//         COUNT(*) AS cnt
//       FROM
//         data_catalog_dev.default.unique_messages_v2
//       WHERE
//         DATE(written_date) = CURRENT_DATE() AND sentiment IS NOT NULL
//       GROUP BY
//         written_date, sentiment
//     ),
//     SentimentTotals AS (
//       SELECT
//         sentiment,
//         SUM(cnt) AS total_count
//       FROM
//         AggregatedMessages
//       GROUP BY
//         sentiment
//       ORDER BY
//         total_count DESC
//       LIMIT 5
//     ),
//     FilteredMessages AS (
//       SELECT
//         am.written_date,
//         am.sentiment,
//         am.cnt
//       FROM
//         AggregatedMessages am
//       JOIN
//         SentimentTotals st
//       ON
//         am.sentiment = st.sentiment
//     ),
//     RankedMessages AS (
//       SELECT
//         written_date,
//         sentiment,
//         cnt,
//         RANK() OVER (
//           PARTITION BY sentiment
//           ORDER BY written_date DESC
//         ) AS rank
//       FROM
//         FilteredMessages
//     )
//     SELECT
//       written_date,
//       sentiment,
//       cnt
//     FROM
//       RankedMessages
//     WHERE
//       rank > 1
//     ORDER BY
//       written_date ASC, sentiment`,
//   ) as Promise<SentimentOverTimeQueryResult>;
// }

async function query(session: IDBSQLSession, sql: string) {
  const queryOperation = await session.executeStatement(sql, {
    runAsync: true,
    maxRows: 10000, // This option enables the direct results feature.
  });

  const result = await queryOperation.fetchAll();
  await queryOperation.close();
  return result;
}

async function expectedMessagesByInterval(session: IDBSQLSession) {
  return query(
    session,
    `select interval, floor(avg(cnt)) as cnt from (
        SELECT  from_unixtime(floor(unix_timestamp(written_at) / 60) * 60) AS time_bin,
                date_format(from_unixtime(floor(unix_timestamp(written_at) / 60) * 60), "HH:mm:ss") as interval,
                COUNT(*) AS cnt
        FROM
          data_catalog_dev.default.unique_messages_v2
        WHERE
          DATE(written_date) between CURRENT_DATE() - interval 7 days and CURRENT_DATE() - interval 1 days
        GROUP BY
          from_unixtime(floor(unix_timestamp(written_at) / 60) * 60)
      )
    group by interval
    order by interval asc;`,
  );
}
