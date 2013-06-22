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


-- Sequence: eb17episodetracker.hibernate_sequence

-- DROP SEQUENCE eb17episodetracker.hibernate_sequence;

CREATE SEQUENCE eb17episodetracker.hibernate_sequence
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2
  CACHE 1;
ALTER TABLE eb17episodetracker.hibernate_sequence
  OWNER TO postgres;


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


-- Sequence: eb17episodetracker.serie_seq

-- DROP SEQUENCE eb17episodetracker.serie_seq;

CREATE SEQUENCE eb17episodetracker.serie_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 3
  CACHE 1;
ALTER TABLE eb17episodetracker.serie_seq
  OWNER TO postgres;


-- Table: eb17episodetracker.serie

-- DROP TABLE eb17episodetracker.serie;

CREATE TABLE eb17episodetracker.serie
(
  id integer NOT NULL,
  title text,
  url text,
  season integer,
  episode integer,
  air_time text,
  air_day text,
  poster text,
  network text,
  CONSTRAINT id_serie PRIMARY KEY (id),
  CONSTRAINT url_unique UNIQUE (url)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE eb17episodetracker.serie
  OWNER TO eb17episodetracker;

  
  -- Table: eb17episodetracker.track

-- DROP TABLE eb17episodetracker.track;

CREATE TABLE eb17episodetracker.track
(
  member integer,
  serie integer,
  CONSTRAINT member_fk FOREIGN KEY (member)
      REFERENCES eb17episodetracker.member (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT serie_fk FOREIGN KEY (serie)
      REFERENCES eb17episodetracker.serie (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE eb17episodetracker.track
  OWNER TO eb17episodetracker;


-- Table: eb17episodetracker.follow

-- DROP TABLE eb17episodetracker.follow;

CREATE TABLE eb17episodetracker.follow
(
  member_fk integer,
  follow integer,
  id integer,
  CONSTRAINT follow_fk FOREIGN KEY (follow)
      REFERENCES eb17episodetracker.member (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT member_fk FOREIGN KEY (member_fk)
      REFERENCES eb17episodetracker.member (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE eb17episodetracker.follow
  OWNER TO postgres;
