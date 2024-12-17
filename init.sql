CREATE DATABASE Northwind;
GO

USE Northwind;
GO

CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    CompanyName NVARCHAR(50),
    ContactName NVARCHAR(50),
    Phone NVARCHAR(20),
    Address NVARCHAR(100)
);
GO

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT,
    OrderDate DATETIME,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
GO

INSERT INTO Customers (CompanyName, ContactName, Phone, Address)
VALUES
  ('Centro comercial Moctezuma', 'Francisco Chang', '555-0309', 'Sierras de Granada 9993'),
    ('Ernst Handel', 'Roland Mendel', '555-0152', 'Kirchgasse 6'),
    ('Island Trading', 'Helen Bennett', '555-0110', 'Garden House Crowther Way'),
    ('Laughing Bacchus Winecellars', 'Yoshi Tannamuri', '555-0111', '1900 Oak St.'),
    ('Magazzini Alimentari Riuniti', 'Giovanni Rovelli', '555-0112', 'Via Ludovico il Moro 22');
GO

INSERT INTO Orders (CustomerID, OrderDate)
VALUES
(1, '2023-12-01'),
(2, '2023-12-05');
GO
