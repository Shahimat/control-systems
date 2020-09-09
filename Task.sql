DROP DATABASE IF EXISTS task;

CREATE DATABASE task;

\c task guest;

-- Договор
CREATE TABLE Contract
(
    id SERIAL,
    ContractNumber VARCHAR(20) NOT NULL,
    ContractDate DATE NOT NULL,
    ContractType VARCHAR(20) NOT NULL,
    id_provider INTEGER,
    id_payer INTEGER,
    Currency VARCHAR(20) NOT NULL, -- Валюта
    filepath VARCHAR(255),

    PRIMARY KEY (id)
);
 
-- Юридическое лицо
CREATE TABLE Person
(
    id SERIAL,
    Name VARCHAR(20) NOT NULL,
    
    PRIMARY KEY (id)
);

-- Фактура
CREATE TABLE Invoice
(
    id SERIAL,
    id_contract_stage INTEGER,
    InvoicePosition VARCHAR(20) NOT NULL,
    InvoiceDate DATE NOT NULL,
    ExecAmmount INTEGER, -- Сумма выполнения
    Quantity INTEGER,    -- Количество
    filepath VARCHAR(255),

    PRIMARY KEY (id)
);

-- Этап договора
CREATE TABLE ContractStage
(
    id SERIAL,
    Name VARCHAR(20) NOT NULL,
    StageDateBegin DATE NOT NULL,
    StageDateEnd DATE NOT NULL,
    Unit VARCHAR(20) NOT NULL, -- Единица измерения
    Ammount INTEGER,           -- Сумма
    Quantity INTEGER,          -- Количество
    filepath VARCHAR(255),

    PRIMARY KEY (id)
);

CREATE TABLE ExecutionDocument
(
    id SERIAL,
    Number VARCHAR(20) NOT NULL,
    DocDate DATE NOT NULL,
    DocType VARCHAR(20) NOT NULL,
    ExecCurrency VARCHAR(20) NOT NULL, -- Валюта выполнения
    filepath VARCHAR(255),

    PRIMARY KEY (id)
);

CREATE TABLE MAP_Contract_ContractStage
(
    id_contract integer,
    id_contract_stage integer,

    PRIMARY KEY (id_contract, id_contract_stage)
);

CREATE TABLE MAP_Invoice_ExecutionDocument
(
    id_invoice integer,
    id_execution_document integer,

    PRIMARY KEY (id_invoice, id_execution_document)
);

-- 1..1 Person Contract
ALTER TABLE Contract
    ADD FOREIGN KEY (id_provider) REFERENCES Person (id);
ALTER TABLE Contract
    ADD FOREIGN KEY (id_payer) REFERENCES Person (id);

-- *..1 MAP_Contract_ContractStage
ALTER TABLE MAP_Contract_ContractStage
    ADD FOREIGN KEY (id_contract) REFERENCES Contract (id);
ALTER TABLE MAP_Contract_ContractStage
    ADD FOREIGN KEY (id_contract_stage) REFERENCES ContractStage (id);

-- *..1 MAP_Contract_ContractStage
ALTER TABLE MAP_Invoice_ExecutionDocument
    ADD FOREIGN KEY (id_invoice) REFERENCES Invoice (id);
ALTER TABLE MAP_Invoice_ExecutionDocument
    ADD FOREIGN KEY (id_execution_document) REFERENCES ExecutionDocument (id);

