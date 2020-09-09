CREATE USER guest WITH PASSWORD 'guest';

ALTER USER guest WITH ENCRYPTED PASSWORD 'guest';
ALTER USER guest nosuperuser nocreaterole nocreatedb;
ALTER DATABASE task OWNER TO guest;

\c task;

ALTER TABLE Contract                      OWNER TO guest;
ALTER TABLE Person                        OWNER TO guest;
ALTER TABLE Invoice                       OWNER TO guest;
ALTER TABLE ContractStage                 OWNER TO guest;
ALTER TABLE ExecutionDocument             OWNER TO guest;
ALTER TABLE MAP_Contract_ContractStage    OWNER TO guest;
ALTER TABLE MAP_Invoice_ExecutionDocument OWNER TO guest;