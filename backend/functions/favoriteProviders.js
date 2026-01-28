const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY
});

const database = client.database(process.env.COSMOS_DB_DATABASE);
const container = database.container(process.env.COSMOS_DB_CONTAINER_PROVIDERS);

// GET - Obtener todos los proveedores favoritos
app.http('getFavoriteProviders', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const appId = request.query.get('appId') || 'default-app-id';
      
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.appId = @appId ORDER BY c.savedAtTimestamp DESC',
        parameters: [{ name: '@appId', value: appId }]
      };

      const { resources } = await container.items.query(querySpec).fetchAll();
      
      return {
        status: 200,
        jsonBody: resources
      };
    } catch (error) {
      context.log.error('Error getting favorite providers:', error);
      return {
        status: 500,
        jsonBody: { error: error.message }
      };
    }
  }
});

// POST - Guardar proveedor favorito
app.http('saveFavoriteProvider', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const appId = body.appId || 'default-app-id';
      
      const document = {
        id: `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appId,
        ...body,
        savedAt: new Date().toISOString(),
        savedAtTimestamp: new Date().getTime()
      };

      const { resource } = await container.items.create(document);
      
      return {
        status: 201,
        jsonBody: resource
      };
    } catch (error) {
      context.log.error('Error saving favorite provider:', error);
      return {
        status: 500,
        jsonBody: { error: error.message }
      };
    }
  }
});

// DELETE - Eliminar proveedor favorito
app.http('deleteFavoriteProvider', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const providerId = request.query.get('id');
      
      if (!providerId) {
        return {
          status: 400,
          jsonBody: { error: 'Provider ID is required' }
        };
      }

      await container.item(providerId).delete();
      
      return {
        status: 200,
        jsonBody: { success: true }
      };
    } catch (error) {
      context.log.error('Error deleting favorite provider:', error);
      return {
        status: 500,
        jsonBody: { error: error.message }
      };
    }
  }
});
