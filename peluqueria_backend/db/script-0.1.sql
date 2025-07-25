CREATE TABLE EstadoPago (
    ID TINYINT PRIMARY KEY,
    NOMBRE VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO EstadoPago (ID, NOMBRE) VALUES
(1, 'Pendiente'),
(2, 'Aprobado'),
(3, 'Rechazado'),
(4, 'Reembolsado'),
(5, 'Cancelado');

CREATE TABLE MetodoPago (
    ID TINYINT PRIMARY KEY,
    NOMBRE VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO MetodoPago (ID, NOMBRE) VALUES
(1, 'MercadoPago'),
(2, 'Efectivo');


CREATE TABLE PAGO (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    RESERVA_ID INT NOT NULL,
    MONTO DECIMAL(10, 2) NOT NULL,
    FECHA_PAGO DATETIME,
    METODO_ID TINYINT NOT NULL,
    ESTADO_ID TINYINT NOT NULL,
    ID_EXTERNO VARCHAR(100), 
    DATOS_PAGO VARCHAR(500), 
    FECHA_ALTA DATETIME DEFAULT GETDATE(),
    USUARIO_ALTA VARCHAR(100),
    FECHA_BAJA DATETIME,
    USUARIO_BAJA VARCHAR(100),

    CONSTRAINT FK_PAGO_RESERVA FOREIGN KEY (RESERVA_ID) REFERENCES RESERVA(ID),
    CONSTRAINT FK_PAGO_ESTADO FOREIGN KEY (ESTADO_ID) REFERENCES EstadoPago(ID),
    CONSTRAINT FK_PAGO_METODO FOREIGN KEY (METODO_ID) REFERENCES MetodoPago(ID)
);

CREATE INDEX IX_PAGO_ID_EXTERNO ON PAGO(ID_EXTERNO);

IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE name = 'PAGO_ID' AND object_id = OBJECT_ID('RESERVA')
)
BEGIN
    ALTER TABLE RESERVA ADD PAGO_ID INT NULL;

    ALTER TABLE RESERVA ADD CONSTRAINT FK_RESERVA_PAGO 
    FOREIGN KEY (PAGO_ID) REFERENCES PAGO(ID);
END
GO




CREATE OR ALTER TRIGGER trg_generar_comprobante_pago
ON PAGO
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @PagoID INT;
    DECLARE @TurnoID INT;
    DECLARE @FechaPago DATETIME;
    DECLARE @Comprobante VARCHAR(100);
    
    SELECT @PagoID = ID, @FechaPago = FECHA_PAGO
    FROM inserted;
    
    SELECT @TurnoID = ID 
    FROM TURNO 
    WHERE PAGO_ID = @PagoID;
    
    SET @Comprobante = CONCAT('PAGO-', @PagoID, 
                             CASE WHEN @TurnoID IS NOT NULL THEN CONCAT('-', @TurnoID) ELSE '' END, 
                             '-', FORMAT(@FechaPago, 'yyyyMMddHHmmss'));
    
    UPDATE PAGO
    SET COMPROBANTE = @Comprobante
    WHERE ID = @PagoID;
END