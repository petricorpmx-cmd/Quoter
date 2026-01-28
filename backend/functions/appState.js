const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY
});

const database = client.database(process.env.COSMOS_DB_DATABASE);
const container = database.container(process.env.COSMOS_DB_CONTAINER_APP_STATE);

app.http('getAppState', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const appId = request.query.get('appId') || 'default-app-id';
      
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.appId = @appId',
        parameters: [{ name: '@appId', value: appId }]
      };

      const { resources } = await container.items.query(querySpec).fetchAll();
      
      if (resources.length === 0) {
        return {
          status: 200,
          jsonBody: null
        };
      }

      return {
        status: 200,
        jsonBody: resources[0]
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
    try {
      const body = await request.json();
      const appId = body.appId || 'default-app-id';
      
      const document = {
        id: `appState-${appId}`,
        appId,
        ...body.data,
        lastUpdated: new Date().toISOString()
      };

      await container.items.upsert(document);
      
      return {
        status: 200,
        jsonBody: { success: true, id: document.id }
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
