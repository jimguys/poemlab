--
-- PostgreSQL database dump
--

\c poemlab

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.poets_poems DROP CONSTRAINT poets_poems_poet_id_fkey;
ALTER TABLE ONLY public.poets_poems DROP CONSTRAINT poets_poems_poem_id_fkey;
ALTER TABLE ONLY public.lines DROP CONSTRAINT lines_poet_id_fkey;
ALTER TABLE ONLY public.lines DROP CONSTRAINT lines_poem_id_fkey;
ALTER TABLE ONLY public.poets_poems DROP CONSTRAINT poets_poems_pkey;
ALTER TABLE ONLY public.poets DROP CONSTRAINT poets_pkey;
ALTER TABLE ONLY public.poets DROP CONSTRAINT poets_name_key;
ALTER TABLE ONLY public.poets DROP CONSTRAINT poets_email_key;
ALTER TABLE ONLY public.poems DROP CONSTRAINT poems_pkey;
ALTER TABLE ONLY public.lines DROP CONSTRAINT lines_pkey;
DROP TABLE public.poets_poems;
DROP TABLE public.poets;
DROP SEQUENCE public.poet_id_seq;
DROP TABLE public.poems;
DROP SEQUENCE public.poem_id_seq;
DROP TABLE public.lines;
DROP SEQUENCE public.line_id_seq;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';

SET search_path = public, pg_catalog;

--
-- Name: line_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: lines; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE lines (
    id integer DEFAULT nextval('line_id_seq'::regclass) NOT NULL,
    poem_id integer NOT NULL,
    poet_id integer NOT NULL,
    text character varying(200) NOT NULL
);


--
-- Name: poem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poem_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poems; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE poems (
    id integer DEFAULT nextval('poem_id_seq'::regclass) NOT NULL,
    name character varying(100)
);


--
-- Name: poet_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poets; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE poets (
    id integer DEFAULT nextval('poet_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character(64) NOT NULL
);


--
-- Name: poets_poems; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE poets_poems (
    poet_id integer NOT NULL,
    poem_id integer NOT NULL
);


--
-- Name: lines_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY lines
    ADD CONSTRAINT lines_pkey PRIMARY KEY (id);


--
-- Name: poems_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY poems
    ADD CONSTRAINT poems_pkey PRIMARY KEY (id);


--
-- Name: poets_email_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY poets
    ADD CONSTRAINT poets_email_key UNIQUE (email);


--
-- Name: poets_name_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY poets
    ADD CONSTRAINT poets_name_key UNIQUE (name);


--
-- Name: poets_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY poets
    ADD CONSTRAINT poets_pkey PRIMARY KEY (id);


--
-- Name: poets_poems_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY poets_poems
    ADD CONSTRAINT poets_poems_pkey PRIMARY KEY (poet_id, poem_id);


--
-- Name: lines_poem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lines
    ADD CONSTRAINT lines_poem_id_fkey FOREIGN KEY (poem_id) REFERENCES poems(id);


--
-- Name: lines_poet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lines
    ADD CONSTRAINT lines_poet_id_fkey FOREIGN KEY (poet_id) REFERENCES poets(id);


--
-- Name: poets_poems_poem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poets_poems
    ADD CONSTRAINT poets_poems_poem_id_fkey FOREIGN KEY (poem_id) REFERENCES poems(id);


--
-- Name: poets_poems_poet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poets_poems
    ADD CONSTRAINT poets_poems_poet_id_fkey FOREIGN KEY (poet_id) REFERENCES poets(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;

--
-- PostgreSQL database dump complete
--

