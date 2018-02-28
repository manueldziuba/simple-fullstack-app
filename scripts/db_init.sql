CREATE TABLE IF NOT EXISTS %TBLNAME% (
  "id"         SERIAL PRIMARY KEY,
  "city"       varchar(50) NOT NULL,
  "start_date" date,
  "end_date"   date,
  "price"      numeric,
  "status"     varchar(25),
  "color"      char(7)
);