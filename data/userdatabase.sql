DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.planet_votes;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP SEQUENCE IF EXISTS public.planet_votes_id_seq;

CREATE TABLE users (
    id integer NOT NULL,
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
    ADD CONSTRAINT pk_username PRIMARY KEY (username);
ALTER TABLE ONLY users
    ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);
ALTER TABLE ONLY users
    ADD CONSTRAINT user_id_uk UNIQUE (id);

CREATE TABLE planet_votes (
    id integer NOT NULL,
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
    ADD CONSTRAINT pk_id PRIMARY KEY (id);
ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY planet_votes
    ALTER COLUMN id SET DEFAULT nextval('planet_votes_id_seq'::regclass);

INSERT INTO users VALUES (1, 'admin', 'admin');
SELECT pg_catalog.setval('users_id_seq', 1, true);