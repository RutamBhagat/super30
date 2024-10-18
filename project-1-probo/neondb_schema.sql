--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4 (Ubuntu 16.4-0ubuntu0.24.04.2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO neondb_owner;

--
-- Name: gender; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.gender AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public.gender OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: neondb_owner
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: neondb_owner
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: neondb_owner
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: onramps; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.onramps (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    amount integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.onramps OWNER TO neondb_owner;

--
-- Name: onramps_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.onramps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.onramps_id_seq OWNER TO neondb_owner;

--
-- Name: onramps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.onramps_id_seq OWNED BY public.onramps.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    stock_symbol text NOT NULL,
    quantity integer NOT NULL,
    price integer NOT NULL,
    stock_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: symbols; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.symbols (
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.symbols OWNER TO neondb_owner;

--
-- Name: trades; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.trades (
    id integer NOT NULL,
    buyer_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    stock_symbol text NOT NULL,
    quantity integer NOT NULL,
    price integer NOT NULL,
    stock_type text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trades OWNER TO neondb_owner;

--
-- Name: trades_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.trades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trades_id_seq OWNER TO neondb_owner;

--
-- Name: trades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.trades_id_seq OWNED BY public.trades.id;


--
-- Name: user_balances; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_balances (
    user_id uuid NOT NULL,
    balance integer DEFAULT 0 NOT NULL,
    locked integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_balances OWNER TO neondb_owner;

--
-- Name: user_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_tokens (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    stock_symbol text NOT NULL,
    token_type text NOT NULL,
    quantity integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_tokens OWNER TO neondb_owner;

--
-- Name: user_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_tokens_id_seq OWNER TO neondb_owner;

--
-- Name: user_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_tokens_id_seq OWNED BY public.user_tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    email text,
    is_admin boolean DEFAULT false,
    password text DEFAULT '123456'::text NOT NULL,
    is_verified boolean DEFAULT true NOT NULL,
    salt text NOT NULL,
    code text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: onramps id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onramps ALTER COLUMN id SET DEFAULT nextval('public.onramps_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: trades id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trades ALTER COLUMN id SET DEFAULT nextval('public.trades_id_seq'::regclass);


--
-- Name: user_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_tokens ALTER COLUMN id SET DEFAULT nextval('public.user_tokens_id_seq'::regclass);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: onramps onramps_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onramps
    ADD CONSTRAINT onramps_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: symbols symbols_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.symbols
    ADD CONSTRAINT symbols_pkey PRIMARY KEY (name);


--
-- Name: trades trades_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_pkey PRIMARY KEY (id);


--
-- Name: user_balances user_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_balances
    ADD CONSTRAINT user_balances_pkey PRIMARY KEY (user_id);


--
-- Name: user_tokens user_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT user_tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: onramps onramps_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onramps
    ADD CONSTRAINT onramps_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders orders_stock_symbol_symbols_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_stock_symbol_symbols_name_fk FOREIGN KEY (stock_symbol) REFERENCES public.symbols(name);


--
-- Name: orders orders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: trades trades_buyer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_buyer_id_users_id_fk FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- Name: trades trades_seller_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_seller_id_users_id_fk FOREIGN KEY (seller_id) REFERENCES public.users(id);


--
-- Name: trades trades_stock_symbol_symbols_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_stock_symbol_symbols_name_fk FOREIGN KEY (stock_symbol) REFERENCES public.symbols(name);


--
-- Name: user_balances user_balances_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_balances
    ADD CONSTRAINT user_balances_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_tokens user_tokens_stock_symbol_symbols_name_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT user_tokens_stock_symbol_symbols_name_fk FOREIGN KEY (stock_symbol) REFERENCES public.symbols(name);


--
-- Name: user_tokens user_tokens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT user_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

