-- Esquema de base de datos para Azure SQL Database
-- Migración de Firebase/Cosmos DB a SQL

-- Tabla para el estado de la aplicación
CREATE TABLE AppState (
    Id NVARCHAR(100) PRIMARY KEY,
    AppId NVARCHAR(100) NOT NULL,
    Items NVARCHAR(MAX), -- JSON string con los items
    IvaRate DECIMAL(5,2) DEFAULT 16.00,
    LastUpdated DATETIME2 DEFAULT GETUTCDATE(),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Índice para búsquedas por AppId
CREATE INDEX IX_AppState_AppId ON AppState(AppId);

-- Tabla para proveedores favoritos
CREATE TABLE FavoriteProviders (
    Id NVARCHAR(100) PRIMARY KEY,
    AppId NVARCHAR(100) NOT NULL,
    Nombre NVARCHAR(500) NOT NULL,
    Costo DECIMAL(18,2) DEFAULT 0,
    AplicaIva BIT DEFAULT 1,
    Margen DECIMAL(5,2) DEFAULT 0,
    Link NVARCHAR(1000),
    ProductoNombre NVARCHAR(500),
    ProductoId NVARCHAR(100),
    Cantidad INT DEFAULT 1,
    Calculos NVARCHAR(MAX), -- JSON string con los cálculos
    IvaRate DECIMAL(5,2) DEFAULT 16.00,
    SavedAt DATETIME2 DEFAULT GETUTCDATE(),
    SavedAtTimestamp BIGINT,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Índices para búsquedas
CREATE INDEX IX_FavoriteProviders_AppId ON FavoriteProviders(AppId);
CREATE INDEX IX_FavoriteProviders_SavedAtTimestamp ON FavoriteProviders(SavedAtTimestamp DESC);

-- Función para actualizar LastUpdated automáticamente
CREATE TRIGGER TR_AppState_UpdateTimestamp
ON AppState
AFTER UPDATE
AS
BEGIN
    UPDATE AppState
    SET LastUpdated = GETUTCDATE()
    WHERE Id IN (SELECT Id FROM inserted);
END;
