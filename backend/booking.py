from cgi import print_exception
import sqlite3 as sl
from datetime import datetime 
from random import seed
from random import randrange
from threading import Timer
import datetime

from db_dictionary import dict_factory, post_row, update_row

global booking_id 
booking_id = 9

# id 						serial, 
# booking_number 			text not null unique,
# car_space 				integer not null, 
# consumer 				integer not null,
# start_time 				text,
# end_time 				text,
# price 					integer,
# status 					text check (status in ('Pending', 'Completed/Paid', 'Expired', 'Canceled')),
# creation_time 			text,
# car_type                text,
# car_registraion         text,

def create_booking(input):
	
	global booking_id
	input["id"] = booking_id
	input["creation_time"] = f"{datetime.datetime.now()}"
	input["consumer"] = input.pop("user_id")
	seed(booking_id)
	booking_number = "B" + str(randrange(1000000))
	while exists_booking_number(booking_number):
		booking_number = "B" + str(randrange(1000000))

	input["booking_number"] = booking_number
	total_hours = input["total_hours"]

	con = sl.connect('my-test.db')
	post_row(con, "booking", input)
	
	booking_id = booking_id + 1

	# adding hours of booking to car space
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = "SELECT * FROM car_spaces WHERE id = {};".format(input["car_space"])
	cur.execute(sql_query)
	record = cur.fetchone()
	hours_used = 0

	if record:
		hours_used = record["hours_used"]

	sql_query2 = "UPDATE car_spaces SET hours_used = {} WHERE id = {};".format(hours_used + total_hours, input["car_space"])
	cur.execute(sql_query2)
	con.commit()
	con.close()

	expiry_timer(booking_id - 1)

	return booking_id - 1



def get_bookings_by_userid(user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM booking WHERE consumer = {user_id};"
	cur.execute(sql_query)
	records = cur.fetchall()

	if not records:
		return 404, None
	
	return 200, records

def get_bookings_by_listingid(listing_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM booking WHERE car_space = {listing_id};"
	cur.execute(sql_query)
	records = cur.fetchall()

	if not records:
		return 404, None
	
	return 200, records

def get_valid_bookings_by_listingid(listing_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM booking WHERE car_space = {listing_id} AND status != ?;"
	cur.execute(sql_query, ("Expired", ))
	records = cur.fetchall()

	if not records:
		return 404, None
	
	return 200, records

def get_all_bookings():
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM booking;"
	cur.execute(sql_query)
	records = cur.fetchall()

	if not records:
		return 404, None
	
	return 200, records

def get_booking_by_bookingid(id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM booking WHERE id = {id};"
	cur.execute(sql_query)
	record = cur.fetchone()

	if not record:
		return 404, None
	
	return 200, record

def update_booking(input):

	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	# adding / subtracting hours of booking to car space
	previous_hours_used = 0
	code, booking = get_booking_by_bookingid(input['booking_id'])
	previous_hours_used = booking['total_hours']
	sql_query = "SELECT * FROM car_spaces WHERE id = {};".format(input["car_space"])
	cur.execute(sql_query)
	record = cur.fetchone()
	hours_used = 0
	
	if record:
		hours_used = record["hours_used"]
	
	hours_to_add = input['total_hours'] - previous_hours_used
	sql_query2 = "UPDATE car_spaces SET hours_used = {} WHERE id = {};".format(hours_used + hours_to_add, input["car_space"])
	cur.execute(sql_query2)
 
	booking_id = input.pop("booking_id")

	if not exists_booking_id(booking_id):
		return 404
	
	update_row(con, "booking", input, booking_id)
	
	con.commit()
	con.close()
 	

	return 200

def delete_booking(booking_id):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = f"DELETE FROM booking WHERE id = {booking_id};"
	cur.execute(sql_query)
	con.commit()
	con.close()
	return 200
 
# Check if this user is the one who made the booking
def is_booker(booking_id, user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM booking WHERE id = {booking_id};"

	cur.execute(sql_query)
	record = cur.fetchone()

	if record["consumer"] == user_id:
		return True

	return False

def exists_booking_number(booking_num):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = "SELECT * FROM booking WHERE booking_number = (?);"
	cur.execute(sql_query, (booking_num, ))
	record = cur.fetchone()
	if record:
		return True

	return False


def exists_booking_id(booking_id):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = "SELECT * FROM booking WHERE id = (?);"
	cur.execute(sql_query, (booking_id, ))
	record = cur.fetchone()
	if record:
		return True

	return False

# change a booking's status to expired
def change_status(booking_id, status):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM booking WHERE id = {booking_id}"
	cur.execute(sql_query)
	record = cur.fetchone()

	if not record:
		return 404

	# if completed/paid: return
	current_status = record["status"]
	if current_status == "Completed/Paid":
		return 200


	sql_query = f"UPDATE booking SET status = ? WHERE id = {booking_id}"

	data = [(status)]

	cur.executemany(sql_query, (data, ))

	con.commit()
	con.close()

	return 200

# timer on a separate thread
def expiry_timer(booking_id):

	# subject to change
	duration = 30.0
	t = Timer(duration, change_status, args=[booking_id, "Expired"])
	t.start()

def calculate_booking_total_time(input):
	booking_start_time = input['booking_start_time']
	datetime_obj_booking_start = datetime.datetime.strptime(booking_start_time, '%Y-%m-%d %H:%M:%S')
	booking_start_hour = datetime_obj_booking_start.hour
	
	booking_end_time = input['booking_end_time']
	datetime_obj_booking_end = datetime.datetime.strptime(booking_end_time, '%Y-%m-%d %H:%M:%S')
	booking_end_hour = datetime_obj_booking_end.hour
    
	booked_car_space_id = input['car_space_id']

	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM car_spaces WHERE id = {booked_car_space_id};"
	cur.execute(sql_query)
	record = cur.fetchone()
	total_hours_used = 0

	# calculate how many hours a week the car space is free
	day_dict = {}
	day_dict[1] = record["monday"]
	day_dict[2] = record["tuesday"]
	day_dict[3] = record["wednesday"]
	day_dict[4] = record["thursday"]
	day_dict[5] = record["friday"]
	day_dict[6] = record["saturday"]
	day_dict[0] = record["sunday"]
	
	starttime = record["starttime"]
	endtime = record["endtime"]
	useable_hours_per_day = endtime - starttime
	first_day_hour = endtime - booking_start_hour
	last_day_hour = booking_end_hour - starttime
	
	first_day_counter = 0
	while datetime_obj_booking_start < datetime_obj_booking_end: 
		# 1,2,3,4,5,6,0
		num_of_day = datetime_obj_booking_start.weekday()
		if day_dict[num_of_day] == 1:
			# detect if it's first day
			if first_day_counter == 0:
				total_hours_used = total_hours_used + first_day_hour
				first_day_counter = 1
			# detect if it's last day
			elif (datetime_obj_booking_start + datetime.timedelta(days=1)) > datetime_obj_booking_end:
				total_hours_used = total_hours_used + last_day_hour
			else:	
				total_hours_used = total_hours_used + useable_hours_per_day
		datetime_obj_booking_start = datetime_obj_booking_start + datetime.timedelta(days=1)
	return total_hours_used