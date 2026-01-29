const { app } = require('@azure/functions');
const { getConnection, sql } = require('../database/connection');

app.http('getAppState', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    let pool;
    try {
      const appId = request.query.get('appId') || 'default-app-id';
      const stateId = `appState-${appId}`;
      
      pool = await getConnection();
      
      const result = await pool.request()
        .input('id', sql.NVarChar, stateId)
        .query('SELECT * FROM AppState WHERE Id = @id');
      
      if (result.recordset.length === 0) {
        return {
          status: 200,
          jsonBody: null
        };
      }

      const record = result.recordset[0];
      const appState = {
        id: record.Id,
        appId: record.AppId,
        items: record.Items ? JSON.parse(record.Items) : [],
        ivaRate: record.IvaRate,
        lastUpdated: record.LastUpdated
      };

      return {
        status: 200,
        jsonBody: appState
      };
    } catch (error) {
      context.log.error('Error getting app state:', error);
      return {
        status: 500,
        jsonBody: { error: error.message }
      };
    }
  }
});

app.http('saveAppState', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    let pool;
    try {
      const body = await request.json();
      const appId = body.appId || 'default-app-id';
      const stateId = `appState-${appId}`;
      
      pool = await getConnection();
      
      const itemsJson = JSON.stringify(body.data?.items || []);
      const ivaRate = body.data?.ivaRate || 16;
      
      await pool.request()
        .input('id', sql.NVarChar, stateId)
        .input('appId', sql.NVarChar, appId)
        .input('items', sql.NVarChar(sql.MAX), itemsJson)
        .input('ivaRate', sql.Decimal(5, 2), ivaRate)
        .query(`
          MERGE AppState AS target
          USING (SELECT @id AS Id, @appId AS AppId, @items AS Items, @ivaRate AS IvaRate) AS source
          ON target.Id = source.Id
          WHEN MATCHED THEN
            UPDATE SET Items = source.Items, IvaRate = source.IvaRate, LastUpdated = GETUTCDATE()
          WHEN NOT MATCHED THEN
            INSERT (Id, AppId, Items, IvaRate) VALUES (source.Id, source.AppId, source.Items, source.IvaRate);
        `);
      
      return {
        status: 200,
        jsonBody: { success: true, id: stateId }
      };
    } catch (error) {
      context.log.error('Error saving app state:', error);
      return {
        status: 500,
        jsonBody: { error: error.message }
      };
    }
  }
});
