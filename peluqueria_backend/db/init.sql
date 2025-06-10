CREATE DATABASE PeluqueriaDB;
GO
USE PeluqueriaDB;
GO

CREATE TABLE Appointment (
    id INT IDENTITY(1,1) PRIMARY KEY,
    date DATETIME NOT NULL,
    service_type NVARCHAR(100) NOT NULL,
    notes NVARCHAR(MAX)
);
GO
