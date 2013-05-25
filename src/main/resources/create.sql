-- Role: eb17episodetracker

-- DROP ROLE eb17episodetracker;

CREATE ROLE eb17episodetracker LOGIN
  ENCRYPTED PASSWORD 'md5dd8adcb120b0a396da9f1deca103b111'
  SUPERUSER INHERIT NOCREATEDB CREATEROLE NOREPLICATION;


-- Database: eb17episodetracker

-- DROP DATABASE eb17episodetracker;

CREATE DATABASE eb17episodetracker
  WITH OWNER = eb17episodetracker
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'English_United States.1252'
       LC_CTYPE = 'English_United States.1252'
       CONNECTION LIMIT = -1;


-- Schema: eb17episodetracker

-- DROP SCHEMA eb17episodetracker;

CREATE SCHEMA eb17episodetracker
  AUTHORIZATION eb17episodetracker;


-- Table: eb17episodetracker.member

-- DROP TABLE eb17episodetracker.member;

CREATE TABLE eb17episodetracker.member
(
  id integer NOT NULL,
  surname text,
  email text,
  password text,
  forename text,
  home text,
  CONSTRAINT id PRIMARY KEY (id),
  CONSTRAINT unique_email UNIQUE (email)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE eb17episodetracker.member
  OWNER TO eb17episodetracker;
