from operator import truediv
import sqlite3 as sl
import json
import time
import datetime
import os
from db_dictionary import dict_factory
from sys import platform

global car_space_id 
car_space_id = 9



# no owner, need to add in frontend
def convert_path_to_data(path):
	text_file = open(path, "r")
	data = text_file.read()
	text_file.close()
	return data

def get_picture_path(id):
	cwd = os.getcwd()
	if platform == "linux" or platform == "linux2" or platform == 'darwin':
		directory = f"{cwd}/picture/{id}"
	else:
		directory = f"{cwd}\\picture\\{id}"
	return directory


def create_car_space(input):
	con = sl.connect('my-test.db')

	id = input["listing_id"]
	# delete if already exists
	sql_query = f'''DELETE FROM car_spaces
		WHERE id == {id}'''
	with con:
		con.execute(sql_query)		
 
	
	name = input["name"]
	owner = input["user_id"]
	address = input["address"]

	cwd = os.getcwd()
	photo_path = get_picture_path(id)
	text_file = open(photo_path, "w+")
	n = text_file.write(input["photo_link"])
	text_file.close()
	photo_link = photo_path
	
	space_type = input["space_type"]

	amenity_24_7 = input["amenity_24_7"]
	amenity_sheltered = input["amenity_sheltered"] 
	amenity_security_gates = input["amenity_security_gates"]

	description = input["description"]
	instruction = input["instruction"]
	monday = input["monday"]
	tuesday = input["tuesday"]
	wednesday = input["wednesday"]
	thursday = input["thursday"]
	friday = input["friday"]
	saturday = input["saturday"]
	sunday = input["sunday"]
	starttime = input["starttime"]
	endtime = input["endtime"]
	price_hourly = input["price_hourly"]
	price_daily = input["price_daily"]
	postcode = input["postcode"]
	coordinates = input["coordinates"]
	creation_date = int(time.time())
	
	
	sql_query = '''INSERT INTO car_spaces (id, name, owner, address, coordinates, description, 
 	instruction, price_hourly, price_daily, postcode, photo_link, space_type, amenity_24_7, amenity_sheltered, 
  	amenity_security_gates, monday, tuesday, wednesday, thursday, friday, saturday, sunday, starttime, endtime,
   	creation_date, hours_used) 
   	values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''
	data = [(id, name, owner, address, coordinates, description, 
	instruction, price_hourly, price_daily, postcode, photo_link, space_type,
	amenity_24_7, amenity_sheltered, amenity_security_gates, monday, tuesday, wednesday, thursday, friday,
 	saturday, sunday, starttime, endtime, creation_date, 0)]
	with con:
		con.executemany(sql_query, data)

	con.commit()
	con.close()
	return


def delete_car_space(id, user_id):
	con = sl.connect('my-test.db')
	cur = con.cursor()

	sql_query = f'''SELECT * FROM car_spaces
		WHERE id = {id};'''
	
	cur.execute(sql_query)
	data = cur.fetchall()
	if len(data) == 0:
		return 404

	sql_query = "DELETE FROM car_spaces WHERE id = ?;"
	cur.execute(sql_query, (id,))
	con.commit()

	# check if deleted
	sql_query = f'''SELECT * FROM car_spaces
		WHERE id = {id};'''
	
	cur.execute(sql_query)
	data = cur.fetchall()
	if len(data) != 0:
		return 500

	con.close()

	return 200



def get_listing_by_id(id):
	#try:
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM car_spaces WHERE id = {id};"
	cur.execute(sql_query)
	record = cur.fetchone()

	
	if not record:
		return 404, None

	sql_query = f'SELECT * FROM booking WHERE car_space = {id}'
	cur.execute(sql_query)
	records = cur.fetchall()
	bookings_num = 0
	bookings_in_the_past = 0
	now = datetime.datetime.now()
	for record2 in records:
		bookings_num = bookings_num + 1
		booking_end_time = record2['end_time']
		datetime_booking_end_time = datetime.datetime.strptime(booking_end_time, '%Y-%m-%d %H:%M:%S')
		if datetime_booking_end_time < now:
			bookings_in_the_past = bookings_in_the_past + 1
	
	record['total_bookings'] = bookings_num
	try:
		percent = bookings_in_the_past / bookings_num
	except ZeroDivisionError:
		percent = 0
	record['percentage_bookings'] = round(percent, 2) * 100

	car_space_id = record["id"]
	photo_path = get_picture_path(car_space_id)
	record["photo_link"] = convert_path_to_data(photo_path)

	return 200, record

def get_listings_all():
	#try:
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = "SELECT * FROM car_spaces;"
	cur.execute(sql_query)
	records = cur.fetchall()

	for record in records:
		car_space_id = record["id"]
		photo_path = get_picture_path(car_space_id)
		record["photo_link"] = convert_path_to_data(photo_path)
	return records

def get_listing_by_userid(userid):
    	#try:
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM car_spaces WHERE owner = {userid};"
	cur.execute(sql_query)
	records = cur.fetchall()

	
	if not records:
		return 404, None

	final_list = []
	for record in records:
		
		id = record['id']
		sql_query = f'SELECT * FROM booking WHERE car_space = {id}'
		cur.execute(sql_query)
		records = cur.fetchall()
		bookings_num = 0
		bookings_in_the_past = 0
		now = datetime.datetime.now()
		for record2 in records:
			bookings_num = bookings_num + 1
			booking_end_time = record2['end_time']
			datetime_booking_end_time = datetime.datetime.strptime(booking_end_time, '%Y-%m-%d %H:%M:%S')
			if datetime_booking_end_time < now:
				bookings_in_the_past = bookings_in_the_past + 1
		
		record['total_bookings'] = bookings_num
		percent = 0
		try:
			percent = bookings_in_the_past / bookings_num
		except ZeroDivisionError:
			percent = 0
		record['percentage_bookings'] = round(percent, 2)

		car_space_id = record["id"]
		photo_path = get_picture_path(car_space_id)
		record["photo_link"] = convert_path_to_data(photo_path)

		final_list.append(record)
  		
	
	return 200, final_list

# checks if car space belongs to a user
def is_owner(listing_id, user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM car_spaces WHERE id = {listing_id};"

	cur.execute(sql_query)
	record = cur.fetchone()

	if record["owner"] == user_id:
		return True
	
	return False

# check if a listing exists
def exists(listing_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM car_spaces WHERE id = {listing_id};"

	cur.execute(sql_query)
	record = cur.fetchone()

	if record:
		return True
	
	return False

def is_valid_time(listing_id, booking_start_time, booking_end_time):

	start_time = datetime.datetime.fromisoformat(booking_start_time)
	start_hour = start_time.hour

	end_time = datetime.datetime.fromisoformat(booking_end_time)
	end_hour = end_time.hour

	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM car_spaces WHERE id = {listing_id};"

	cur.execute(sql_query)
	record = cur.fetchone()

	if not record:
		return False
	
	if start_hour >= record["starttime"] and end_hour <= record["endtime"]:
		return True
		
	return False