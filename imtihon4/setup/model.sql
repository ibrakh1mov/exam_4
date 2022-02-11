create database online_shop;

\c online_shop;

create extension pgcrypto;


create table users (
	user_id serial primary key,
	username character varying(30) not null unique,
	contact character varying(12) not null check (contact ~* '^998(9[01345789]|6[125679]|7[01234569]|33)[0-9]{7}$'),
	email character varying(100) not null check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
	password character varying(256) not null,
	role character varying(30) check(role in ('admin', 'users'))
);

create table categories (
	category_id serial primary key,
	category_name character varying(100) not null unique
);

create table products (
	product_id serial primary key,
	category_id int references categories(category_id) on delete cascade,
	product_name character varying(100) unique not null,
	product_price bigint not null,
	short_info character varying(100) not null,
	long_info text not null,
	file_path character varying(200) not null
);

create table orders (
	order_id serial primary key,
	user_id int not null references users(user_id) on delete cascade,
	product_id int not null references products(product_id) on delete cascade,
	isPaid boolean not null default false
);

insert into users (username, contact, email, password, role) values
('ali', '998909802341', 'ali@gmail.com', crypt('1234', gen_salt('bf')), 'users'),
('admin', '998991471707', 'alisher@gmail.com', crypt('admin', gen_salt('bf')), 'admin'),
('nosir', '998998872341', 'nosir@gmail.com', crypt('1234', gen_salt('bf')), 'users');

insert into categories (category_name) values
('cars'),
('phones'),
('sports equipment');

insert into products (category_id, product_name, product_price, short_info, long_info, file_path) values
(1, 'Centra', 150000000, 'Juda yaxshi mashina', 'Mingan inson mazza qiladi', 'car.jpg'),
(2, 'Iphone 11', 5500000, '1 oy ishlatilingan, xolati ideal', 'Tutgan inson mazza qiladi', 'iphone.jpg'),
(2, 'Samsun S10+', 4500000, '6 oy ishlatilingan, xolati norm', 'Aybi yoq', 'samsung.jpg'),
(5, 'Samsun S10+', 4500000, '6 oy ishlatilingan, xolati norm', 'Aybi yoq', 'samsung.jpg'),
(3, 'Yugurish yo‘lakchasi PowerGym PG 730', 10400000, 'Yugurish yo‘lakchasi PowerGym PG 730 arzon narxlarda xarid qiling', 'Kreditsiz Yugurish yo‘lakchasi PowerGym PG 730 muddatli tolov, kafolatli. Ozbekiston - bepul yetkaziladi', 'yugurish_moslamasi.jpg');

insert into orders (user_id, product_id) values
(1, 3),
(3, 1);


select 
	o.*,
	json_agg(op.product_id) as products,
	sum(p.product_price) as totalPrice
from orders o
right join order_products op on o.order_id = op.order_id
right join products p on op.product_id = p.product_id
group by o.order_id;


SELECT 
	o.*, 
	p.product_name, 
	count(o.product_id), 
	p.product_price 
FROM orders o LEFT JOIN products p ON o.product_id = p.product_id 
WHERE o.user_id = 1 and o.ispaid = false 
GROUP BY o.user_id, o.order_id, p.product_name, p.product_id