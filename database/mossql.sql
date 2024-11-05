--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aa (
);


ALTER TABLE public.aa OWNER TO postgres;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    detail character varying,
    addons character varying,
    "addonsPrice" integer
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_cart_id_seq OWNER TO postgres;

--
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;


--
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    order_item_id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    detail character varying,
    addons character varying,
    "addonsPrice" integer
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- Name: order_item_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_item_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_item_order_item_id_seq OWNER TO postgres;

--
-- Name: order_item_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_item_order_item_id_seq OWNED BY public.order_item.order_item_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    status character varying NOT NULL,
    total_amount numeric NOT NULL,
    delivery_to character varying NOT NULL,
    create_at timestamp without time zone NOT NULL,
    review boolean,
    rating integer NOT NULL,
    "reviewText" character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying NOT NULL,
    category character varying NOT NULL,
    price numeric NOT NULL,
    "imageUrl" character varying NOT NULL,
    status character varying NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL,
    description character varying
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    password character varying NOT NULL,
    email character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_info (
    user_id integer NOT NULL,
    role character varying NOT NULL,
    email character varying NOT NULL,
    username character varying,
    phone integer,
    address character varying,
    name character varying,
    lastname character varying,
    phoneads integer
);


ALTER TABLE public.user_info OWNER TO postgres;

--
-- Name: user_info_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_info_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_info_user_id_seq OWNER TO postgres;

--
-- Name: user_info_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_info_user_id_seq OWNED BY public.user_info.user_id;


--
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_user_id_seq OWNER TO postgres;

--
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- Name: order_item order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_item_order_item_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- Name: user_info user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info ALTER COLUMN user_id SET DEFAULT nextval('public.user_info_user_id_seq'::regclass);


--
-- Data for Name: aa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.aa  FROM stdin;
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (cart_id, user_id, product_id, quantity, detail, addons, "addonsPrice") FROM stdin;
90	1	16	1	\N	[]	0
91	1	16	1	\N	[]	0
92	1	17	1	\N	[]	0
93	1	18	1	\N	[]	0
94	1	19	1	\N	[]	0
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (order_item_id, order_id, product_id, quantity, detail, addons, "addonsPrice") FROM stdin;
27	31	15	1	\N	["Coke","Coke No sugar","Egg Salad Sandwich"]	147
28	32	15	1	\N	["Coke No sugar","Egg Salad Sandwich"]	98
29	33	18	1	\N	["Coke","Coke No sugar","Egg Salad Sandwich"]	147
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, user_id, status, total_amount, delivery_to, create_at, review, rating, "reviewText") FROM stdin;
31	1	เสร็จสิ้น	196	123/1 ต อ จ 73000	2024-11-04 01:41:31.077332	f	1	\N
32	1	เสร็จสิ้น	147	das asd ads dsa 74000	2024-11-04 01:42:47.25521	f	1	\N
33	1	เสร็จสิ้น	386	123/1 ต อ จ 73000	2024-11-04 02:35:21.52137	f	1	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, name, category, price, "imageUrl", status, "updatedAt", description) FROM stdin;
16	Minute Maid Splash	เครื่องดื่ม	49	images/1730487489787-1399700_4700007-large.jpg	active	2024-11-02 01:58:09.814378	
17	Bottle of Water	เครื่องดื่ม	20	images/1730487528003-251805_4700084-large.jpg	active	2024-11-02 01:58:48.028041	
18	Double BBQ Bacon Cheese (Pork)	เบอร์เกอร์	239	images/1730487598487-402340_4701150-large.jpg	active	2024-11-02 01:59:58.512996	
19	Fish N Crisp	เบอร์เกอร์	79	images/1730487616825-831218_4701346-large.jpg	active	2024-11-02 02:00:16.966691	
20	Spicy Chicken Burger	เบอร์เกอร์	119	images/1730487634116-1489834_9300337-large.jpg	active	2024-11-02 02:00:34.24705	
21	Spaghetti Carbonara	พาสต้า	159	images/1730487680530-934417511333c93de13318c34cf208e8.jpg	active	2024-11-02 02:01:20.556341	
22	Fettuccine Alfredo	พาสต้า	149	images/1730487697000-Fettuccine-Alfredo_7.jpg	active	2024-11-02 02:01:37.026214	
23	Spaghetti Bolognese	พาสต้า	159	images/1730487716028-Spaghetti-Bolognese-tall-FS-0204.jpg	active	2024-11-02 02:01:56.054312	
24	BBQ Chicken Waffle Fries	ของทานเล่น	169	images/1730487836449-BBQ-Chicken-Waffle-Fries_exps167539_SD2847494D02_08_2bC_RMS.jpg	active	2024-11-02 02:03:56.579375	
25	French Fry Casserole	ของทานเล่น	179	images/1730487859100-French-Fry-Casserole_EXPS_TOHD24_7899_AlejandroMonfort_4.jpg	active	2024-11-02 02:04:19.127576	
26	Pizza Fries	ของทานเล่น	159	images/1730487877559-Pizza-Fries-Tall-FS-32.jpg	active	2024-11-02 02:04:37.691069	
11	Spicy Chicken Burger Set 	คอมโบเซ็ต	169	images/1730487391573-b4558741-d9e3-4c88-9160-0bc7a5d82346.png	active	2024-11-03 23:29:03.828095	
13	Fish N Crisp Set 	คอมโบเซ็ต	179	images/1730487427026-325d3a89-f646-4762-a3d6-5c3fc74e3a6c.png	active	2024-11-03 23:30:18.958283	
12	Double BBQ Bacon Cheese (Pork) Set 	คอมโบเซ็ต	229	images/1730487409046-3de62477-96a6-4225-a044-edc72c3336bf.png	active	2024-11-03 23:30:22.42007	
27	Spaghetti Bolognese	พาสต้า	159	images/1730498015370-Spaghetti-Bolognese-tall-FS-0204.jpg	inactive	2024-11-03 23:31:28.439274	
14	Coke	เครื่องดื่ม	49	images/1730487456469-251801_4700011-large.jpg	active	2024-11-04 00:57:49.561668	
15	Coke No Sugar	เครื่องดื่ม	49	images/1730487474937-251803_4700053-large.jpg	active	2024-11-04 02:37:41.29832	
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (user_id, password, email) FROM stdin;
1	$2b$10$BwCCvxi4V9yuabyd30gSKOvyDfSNXXfRR9aYOReaxB7zW2hZHP2t2	tik@gmail.com
2	$2b$10$7izVohyFIa0WBLIymWf8AuqZlWmeOvtfN01hffdvzkYGJV/b78diS	moss.piyawat@gmail.com
3	$2b$10$eraNG7aPSXJzuLxhd9Qsd.riJ4Vb07AS/No4lgvRjaoCMCHFntTNO	admin@admin.com
\.


--
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_info (user_id, role, email, username, phone, address, name, lastname, phoneads) FROM stdin;
2	admin	moss.piyawat@gmail.com	Moss	123456789	111/23 ddd aa cc 11111	ฟกหฟกหฟ	\N	9999999
3	admin	admin@admin.com	admin	\N	\N	\N	\N	\N
1	user	tik@gmail.com	test	123456789	123/1 ต อ จ 73000	ทด	สอบ	912345678
\.


--
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 94, true);


--
-- Name: order_item_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_item_order_item_id_seq', 29, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 33, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 30, true);


--
-- Name: user_info_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_info_user_id_seq', 3, true);


--
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 3, true);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- Name: user email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: user_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (user_id, role);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: user_info username_uni; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT username_uni UNIQUE (username);


--
-- PostgreSQL database dump complete
--

