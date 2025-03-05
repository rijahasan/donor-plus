-- create a project called "donor" and then execute this file once only

-- users table contains all information for every user
--  every user is given a unique user ID. This table is used when searching for accounts during login
-- instead of searching through the donor table and then the receiver table to find if an account exists, we will search here

create table users (
    userid int identity(1,1) primary key,
    firstname varchar(50) not null,
    lastname varchar(50) not null,
    email varchar(255) unique not null,
    passwordhash char(60) not null,
    phonenumber varchar(20) not null,
    bloodtype varchar(3) not null,
    role varchar(50) not null  -- 'Donor' or 'Receiver'
);

-- donor table
-- only stores user ID and status indicating if a donor is currently available
-- status will be updated in the database every time a donor changes it

create table donors (
    userid int primary key,
    isavailable bit not null default 0,  -- 0 = not available and 1 = isavailable 
    foreign key (userid) references users(userid)
);

-- receivers table
-- only shows user ID and the urgency level

create table receivers (
    userid int primary key,
    urgencylevel varchar(50) not null,  -- 'Urgent' or 'Normal'.
    foreign key (userid) references users(userid)
);
