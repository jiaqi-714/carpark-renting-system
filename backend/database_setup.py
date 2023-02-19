# COMP3900 CAR SPACE SYSTEM
# Create all table needed for database

import sqlite3 as sl
import os
import shutil
import time
from sys import platform


con = sl.connect('my-test.db')

# delete all table we created
tables = list(con.execute("select name from sqlite_master where type is 'table'"))
con.executescript(';'.join(["drop table if exists %s" %i for i in tables]))

# delete all picture currently in /picture
time.sleep(1)
cwd = os.getcwd()
if platform == "linux" or platform == "linux2":
	picture_directory = f"{cwd}/picture/"
	sample_directory = f"{cwd}/sample_picture/"
elif platform == "win32":
	picture_directory = f"{cwd}\\picture\\"
	sample_directory = f"{cwd}\\sample_picture\\"
elif platform == 'darwin':
	picture_directory = f"{cwd}/picture/"
	sample_directory = f"{cwd}/sample_picture/"
for f in os.listdir(picture_directory):
	os.remove(os.path.join(picture_directory, f))

# fetch all files
for file_name in os.listdir(sample_directory):
    # construct full file path
    source = sample_directory + file_name
    destination = picture_directory + file_name
    # copy only files
    if os.path.isfile(source):
        shutil.copy(source, destination)
print('copied all sample picture to picture', file_name)

user_table = """
	CREATE TABLE users (
		id              	serial,
		password        	text not null,
		email				text check (email like '%@%') not null unique,
							
		is_admin 			boolean not null, 
		name				text,
		reset_code			text,
		PRIMARY KEY (id)
	);
"""

car_space_table = """
	CREATE TABLE car_spaces (
		id 					serial,
		name 				text,
		owner 				integer not null,
		address 			text not null,
		coordinates 		text not null,
		description 		text,
		instruction 		text,
		price_hourly 		integer not null,
		price_daily 		integer not null,
		postcode			integer,
		photo_link 			text,
		space_type 			text check (space_type in ('Indoor lot','Driveway','Undercover','Outside','Block my driveway','Carport','Lock up garage', 'Outdoor lot')) not null,
		amenity_24_7 		boolean default false,
		amenity_sheltered   boolean default false,
		amenity_security_gates boolean default false,
		monday				boolean,
		tuesday				boolean,
		wednesday			boolean,
		thursday			boolean,
		friday				boolean,
		saturday			boolean,
		sunday				boolean,
		starttime  			integer,
		endtime				integer,
		creation_date       integer,
		hours_used          integer,

	
		PRIMARY KEY (id),
		FOREIGN KEY (owner) REFERENCES users(id)
	);
"""
		
review_table = """
	CREATE TABLE reviews (
		id 						serial,
		car_space 				integer not null,
		author 					integer not null,
		rating 					integer,
		description 			text,
		time 					text,
		
		PRIMARY KEY (id),
		FOREIGN KEY (car_space) REFERENCES car_spaces(id),
		FOREIGN KEY (author) 	REFERENCES users(id)
	)
"""

booking_table = """
	CREATE TABLE booking (
		id 						serial, 
		booking_number 			text not null unique,
		car_space 				integer not null, 
		consumer 				integer not null,
		start_time 				text,
		end_time 				text,
		price 					integer,
		status 					text check (status in ('Pending', 'Completed/Paid', 'Expired', 'Canceled')),
		creation_time 			text,
		car_type                text,
		car_registration        text,
		total_hours				integer,
  
		PRIMARY KEY (id),
		FOREIGN KEY (car_space) REFERENCES car_spaces(id),
		FOREIGN KEY (consumer) 	REFERENCES users(id)
	)

"""

# create table we need
with con:
   con.execute(user_table)
   con.execute(car_space_table)
   con.execute(review_table)
#    con.execute(car_table)
   con.execute(booking_table)

sql = 'INSERT INTO users (id, password, email, is_admin, name, reset_code) values(?, ?, ?, ?, ?, "xxxx")'
data = [
	(1, 'valerie', '1@google', 1, 'valerie'),
	(2, 'steph', '2@google', 0, 'steph'),
	(3, 'one', '3@google', 0, 'one'),
	(4, 'alan12138', '4@google', 0,'alan12138'),
	(5, 'jiaqi wang', '5@google', 0,'jiaqi wang'),
	(6, 'adminpw', 'admin@admin', 1, 'admin'),
	(7, 'wjq', '875986101@qq.com', 1, 'wjq'),
]

with con:
	con.executemany(sql, data)
		# monday				boolean,
		# tuesday				boolean,
		# wednesday				boolean,
		# thursday				boolean,
		# friday				boolean,
		# saturday				boolean,
		# sunday				boolean,
		# starttime  			integer,
		# endtime				integer,

sql = 'INSERT INTO car_spaces (id, name, owner, address, coordinates, description, instruction, price_hourly, price_daily, postcode, photo_link, space_type, amenity_24_7, amenity_sheltered, amenity_security_gates, monday, tuesday, wednesday, thursday, friday, saturday, sunday, starttime, endtime, creation_date, hours_used) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 23, ?, ?)'

# time stamp 1657242000 = 2022 July 8 1:0:0 AM GMT
data = [
	(1, 'first car space', 1, 'prince1 st', '-33.907066 151.2365421', 'this is first car space we create', 'do not know what instruction should be', 1, 12, 2088, 'mydirectory/url', 'Driveway', 1657242000, 47),
	(2, 'second car space', 2, 'balfour rd', '-33.905700 151.220909', 'this is 2nd car space we create', 'do not know what instruction should be', 2, 12, 2033, 'mydirectory/url', 'Driveway', 1657242000,47),
	(3, 'third car space', 3, 'prince3 st', '-33.907466 151.2365421', 'this is first car space we create', 'do not know what instruction should be', 3, 15, 2065, 'mydirectory/url', 'Driveway', 1657242000, 47),
	(4, 'fourth car space', 4, 'prince4 st', '-33.907566 151.2365421', 'this is first car space we create', 'do not know what instruction should be', 5, 12, 2089, 'mydirectory/url', 'Driveway', 1657242000,47),
	(5, 'fifth car space', 5, 'prince5 st', '-33.907666 151.2365421', 'this is first car space we create', 'do not know what instruction should be', 1, 2, 2089, 'mydirectory/url', 'Driveway', 1657242000, 0),
	(6, 'sixth car space', 5, 'mosman', '-33.828887505971615 151.24810767991755', 'this is first car space we create', 'do not know what instruction should be', 1, 2, 2088, 'mydirectory/url', 'Driveway', 1657242000, 0),
 	(7, 'sixth car space', 5, 'mosman balmoral', '-33.820432873096365 151.25036707699127', 'this is first car space we create', 'do not know what instruction should be', 1, 2, 2088, 'mydirectory/url', 'Driveway', 1657242000, 0),
]

with con:
	con.executemany(sql, data)

sql = 'INSERT INTO car_spaces (id, name, owner, address, coordinates, description, instruction, price_hourly, price_daily, postcode, photo_link, space_type, amenity_24_7, amenity_sheltered, amenity_security_gates, monday, tuesday, wednesday, thursday, friday, saturday, sunday, starttime, endtime, creation_date, hours_used) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 7, 11, ?, ?)'

data = [
 	(8, 'eightth car space', 5, 'mosman balmoral', '-33.907466 151.2365421', 'this is eightth car space we create', 'do not know what instruction should be', 1, 2, 2088, 'mydirectory/url', 'Driveway', 1657242000, 0),
]

with con:
	con.executemany(sql, data)
# CREATE TABLE reviews (
# 	id 						serial,
# 	car_space 				integer not null,
# 	author 					integer not null,
# 	rating 					integer,
# 	description 			text,
# 	time 					text,

sql = 'INSERT INTO reviews (id, car_space, author, rating, description, time) values(?, ?, ?, ?, ?, ?)'

data = [
	(1, 1, 5, 5, 'this car space is **** ****', '2022/6/19'),
	(2, 1, 5, 4, 'lolololololol', '2022/6/18'),
	(3, 1, 5, 4, 'ggggggggggggfffffffffffff', '2022/6/17'),
	(4, 2, 1, 4, 'another review', '2022/6/20'),
	(5, 3, 1, 5, 'nonononononono', '2022/6/21'),
 	(6, 4, 1, 4, 'yesyesyesyes', '2022/6/22'),
]

with con:
	con.executemany(sql, data)



sql = 'INSERT INTO booking (id, booking_number, car_space, consumer, start_time, end_time, price, status, creation_time, car_type, car_registration, total_hours) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

data = [
	(1, 1, 1, 1, '2022-07-09 01:00:00', '2022-07-13 22:00:00', 5, 'Completed/Paid', '2022-07-08 21:22:03', 'SUV', 'EDG4396', 47),
	(2, 2, 2, 2, '2022-07-10 01:00:00', '2022-07-13 22:00:00', 3, 'Completed/Paid', '2022-07-08 21:22:03', 'truck', 'SDJKS5', 47),
	(3, 3, 3, 3, '2022-07-11 01:00:00', '2022-07-13 22:00:00', 2, 'Completed/Paid', '2022-07-08 21:22:03', 'SUV', 'DFJK14', 47),
 	(4, 4, 4, 4, '2022-07-12 01:00:00', '2022-07-13 22:00:00', 2, 'Completed/Paid', '2022-07-08 21:22:03', 'SUV', 'DFJK14', 47),
	(5, 5, 1, 2, '2022-08-12 01:00:00', '2022-08-13 22:00:00', 2, 'Pending', '2022-07-08 21:22:03', 'SUV', 'DFJK14', 47),
	(6, 6, 6, 1, '2022-07-09 01:00:00', '2022-07-13 22:00:00', 5, 'Completed/Paid', '2022-07-08 21:22:03', 'SUV', 'EDG4396', 47),
]

with con:
	con.executemany(sql, data)


