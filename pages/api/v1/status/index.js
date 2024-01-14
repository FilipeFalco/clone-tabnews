import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersionValue = await database.query("SHOW server_version;");
  const databaseVersionResult = databaseVersionValue.rows[0].server_version;

  const databaseMaxConnectionsValue = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsResult =
    databaseMaxConnectionsValue.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsValue = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsResult =
    databaseOpenedConnectionsValue.rows[0].count;
    
  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionResult,
        max_connections: databaseMaxConnectionsResult,
        opened_connections: databaseOpenedConnectionsResult,
      },
    },
  });
}

export default status;
