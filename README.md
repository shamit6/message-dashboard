###  Runnig in production:

Verify .env file has the following variables:

`DATABRICKS_SERVER_HOSTNAME`<br/>
`DATABRICKS_HTTP_PATH`<br/>
`DATABRICKS_TOKEN`<br/>
`NEXT_PUBLIC_FETCH_INTERVAL_IN_SEC`

Run the following commands:

```
docker build -t nextjs-dashboard .

docker docker run -p 3000:3000 nextjs-dashboard
```