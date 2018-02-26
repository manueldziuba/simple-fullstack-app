CREATE DATABASE %DBNAME% ENCODING 'UTF8';

CREATE TABLE %TBLNAME% (
  "id"         serial PRIMARY KEY,
  "city"       varchar(50) NOT NULL,
  "start_date" date,
  "end_date"   date,
  "price"      numeric,
  "status"     varchar(25),
  "color"      char(7)
);
