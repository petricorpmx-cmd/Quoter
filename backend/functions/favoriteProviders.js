const { app } = require('@azure/functions');
const { getConnection, sql } = require('../database/connection');

// GET - Obtener todos los proveedores favoritos
app.http('getFavoriteProviders', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    let pool;
    try {
      const appId = request.query.get('appId') || 'default-app-id';
      
      pool = await getConnection();
      
      const result = await pool.request()
        .input('appId', sql.NVarChar, appId)
        .query(`
          SELECT * FROM FavoriteProviders 
          WHERE AppId = @appId 
          ORDER BY SavedAtTimestamp DESC
        `);
      
      const providers = result.recordset.map(record => ({
        id: record.Id,
        appId: record.AppId,
        nombre: record.Nombre,
        costo: record.Costo,
        aplicaIva: record.AplicaIva,
        margen: record.Margen,
        link: record.Link,
        productoNombre: record.ProductoNombre,
        productoId: record.ProductoId,
        cantidad: record.Cantidad,
        calculos: record.Calculos ? JSON.parse(record.Calculos) : {},
        ivaRate: record.IvaRate,
        savedAt: record.SavedAt,
        savedAtTimestamp: record.SavedAtTimestamp
      }));
      
      return {
        status: 200,
        jsonBody: providers
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
    let pool;
    try {
      const body = await request.json();
      const appId = body.appId || 'default-app-id';
      const providerId = `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      pool = await getConnection();
      
      const calculosJson = JSON.stringify(body.calculos || {});
      const savedAtTimestamp = Date.now();
      
      await pool.request()
        .input('id', sql.NVarChar, providerId)
        .input('appId', sql.NVarChar, appId)
        .input('nombre', sql.NVarChar, body.nombre || 'Sin nombre')
        .input('costo', sql.Decimal(18, 2), body.costo || 0)
        .input('aplicaIva', sql.Bit, body.aplicaIva !== undefined ? body.aplicaIva : true)
        .input('margen', sql.Decimal(5, 2), body.margen || 0)
        .input('link', sql.NVarChar, body.link || '')
        .input('productoNombre', sql.NVarChar, body.productoNombre || '')
        .input('productoId', sql.NVarChar, body.productoId || '')
        .input('cantidad', sql.Int, body.cantidad || 1)
        .input('calculos', sql.NVarChar(sql.MAX), calculosJson)
        .input('ivaRate', sql.Decimal(5, 2), body.ivaRate || 16)
        .input('savedAtTimestamp', sql.BigInt, savedAtTimestamp)
        .query(`
          INSERT INTO FavoriteProviders 
          (Id, AppId, Nombre, Costo, AplicaIva, Margen, Link, ProductoNombre, ProductoId, Cantidad, Calculos, IvaRate, SavedAtTimestamp)
          VALUES 
          (@id, @appId, @nombre, @costo, @aplicaIva, @margen, @link, @productoNombre, @productoId, @cantidad, @calculos, @ivaRate, @savedAtTimestamp)
        `);
      
      const result = await pool.request()
        .input('id', sql.NVarChar, providerId)
        .query('SELECT * FROM FavoriteProviders WHERE Id = @id');
      
      const provider = result.recordset[0];
      const response = {
        id: provider.Id,
        appId: provider.AppId,
        nombre: provider.Nombre,
        costo: provider.Costo,
        aplicaIva: provider.AplicaIva,
        margen: provider.Margen,
        link: provider.Link,
        productoNombre: provider.ProductoNombre,
        productoId: provider.ProductoId,
        cantidad: provider.Cantidad,
        calculos: provider.Calculos ? JSON.parse(provider.Calculos) : {},
        ivaRate: provider.IvaRate,
        savedAt: provider.SavedAt,
        savedAtTimestamp: provider.SavedAtTimestamp
      };
      
      return {
        status: 201,
        jsonBody: response
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
    let pool;
    try {
      const providerId = request.query.get('id');
      
      if (!providerId) {
        return {
          status: 400,
          jsonBody: { error: 'Provider ID is required' }
        };
      }

      pool = await getConnection();
      
      await pool.request()
        .input('id', sql.NVarChar, providerId)
        .query('DELETE FROM FavoriteProviders WHERE Id = @id');
      
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
