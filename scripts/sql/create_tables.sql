create extension if not exists "uuid-ossp";

create type country_enum as enum ('UK', 'USA', 'Germany');
alter type country_enum owner to helios;

create table servers (
    id uuid default uuid_generate_v4() primary key,
    public_key text not null unique,
    server_uri text not null,
    country country_enum not null
);
alter table servers owner to helios;

create table configs (
    id uuid default uuid_generate_v4() primary key,
    private_key text not null unique,
    user_ip text not null,
    server_id uuid not null references servers(id) on delete cascade
);

create table users (
    id uuid default uuid_generate_v4() primary key,
    email text not null unique,
    created_at timestamp not null default now(),
    last_seen timestamp not null default now()
);

create table devices (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references users(id) on delete cascade,
    name text not null,
    type text not null,
    os text not null,
    mac text not null,
    created_at timestamp not null default now(),
    last_seen timestamp not null default now()
);

create table sessions (
    id uuid default uuid_generate_v4() primary key,
    device_id uuid not null references devices(id) on delete cascade,
    config_id uuid not null references configs(id) on delete cascade
);
