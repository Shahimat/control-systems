DROP DATABASE IF EXISTS Task;

CREATE DATABASE task;

\c task guest;

CREATE TABLE Contracts
(
    id SERIAL,
    TimeStamp TIMESTAMP,
    ContractNumber VARCHAR(20) NOT NULL,
    ContractDate DATE NOT NULL,
    ContractType VARCHAR(20) NOT NULL,
    id_provider INTEGER,
    -- id_payer INTEGER UNIQUE,
    ContractCurrency VARCHAR(20) NOT NULL,

    PRIMARY KEY (id, TimeStamp)
);
 
CREATE TABLE Person
(
    id SERIAL,
    TimeStamp TIMESTAMP,
    Name VARCHAR(20) NOT NULL,
    
    PRIMARY KEY (id, TimeStamp)
);

ALTER TABLE Contracts
    ADD FOREIGN KEY (id_provider) REFERENCES Person (Id) WHERE MAX(Person.TimeStamp);
-- ALTER TABLE Contracts
--     ADD FOREIGN KEY (id_payer) REFERENCES Person (Id);
    

-- INSERT INTO Products (ProductName, Manufacturer, ProductCount, Price)
-- VALUES
-- ('iPhone X', 'Apple', 3, 36000),
-- ('iPhone 8', 'Apple', 2, 41000),
-- ('Galaxy S9', 'Samsung', 2, 46000),
-- ('Galaxy S8 Plus', 'Samsung', 1, 56000),
-- ('Desire 12', 'HTC', 5, 28000);
