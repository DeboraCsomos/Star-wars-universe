DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.planet_votes CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.planet_votes_id_seq CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(15) NOT NULL,
    password text NOT NULL
);

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY users
    ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);
ALTER TABLE ONLY users
    ADD CONSTRAINT username_uk UNIQUE (username);

CREATE TABLE planet_votes (
    id SERIAL PRIMARY KEY NOT NULL,
    planet_id integer,
    planet_name VARCHAR(15),
    user_id integer,
    submission_time date NOT NULL DEFAULT CURRENT_DATE
);

CREATE SEQUENCE planet_votes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY planet_votes
    ALTER COLUMN id SET DEFAULT nextval('planet_votes_id_seq'::regclass);

INSERT INTO users VALUES (1, 'admin', '$2b$12$2lI6IneND1IPgb1Jp3KUbukGfgX/c9DYjgKRSzO/mwxUPhxyhnfSm');
SELECT pg_catalog.setval('users_id_seq', 1, true);