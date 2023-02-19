import sqlite3 as sl
import datetime
from db_dictionary import dict_factory

def average_price_in_suburb(post_code):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM car_spaces WHERE postcode = {post_code};"
	cur.execute(sql_query)
	records = cur.fetchall()
	if (len(records) == 0):
		return 404, {'No car spaces in suburb'}

	total_hourly_price = 0
	total_daily_price = 0
	for record in records:
		total_daily_price = total_daily_price + record["price_daily"]
		total_hourly_price = total_hourly_price + record["price_hourly"]
	return 200, {'hourly_price': total_hourly_price/len(records), 'daily_price':total_daily_price/len(records)}

def average_use_rate_in_suburb(post_code):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM car_spaces WHERE postcode = {post_code};"
	cur.execute(sql_query)
	records = cur.fetchall()
	total_hours_used = 0
	total_hours_avaliable_since_created = 0
	# cycles through car spaces in postcode
	for row in records:
		# calculate how many hours a week the car space is free
		day_dict = {}
		day_dict[1] = row["monday"]
		day_dict[2] = row["tuesday"]
		day_dict[3] = row["wednesday"]
		day_dict[4] = row["thursday"]
		day_dict[5] = row["friday"]
		day_dict[6] = row["saturday"]
		day_dict[0] = row["sunday"]
		
		starttime = row["starttime"]
		endtime = row["endtime"]
		useable_hours_per_day = endtime - starttime
		
		creation_time_stamp = row["creation_date"]
		car_space_id = row["id"]
		sql_query = f"SELECT * FROM booking WHERE car_space = {car_space_id};"
		cur.execute(sql_query)
		records2 = cur.fetchall()
  		# cycles through bookings in car spaces to find latest booking time
		latest_time = datetime.datetime(2022, 5, 15)
		for booking in records2:
			end_time = booking["end_time"]
			date_time_obj_end = datetime.datetime.strptime(end_time, '%Y-%m-%d %H:%M:%S')
			if date_time_obj_end > latest_time:
				latest_time = date_time_obj_end

		creation_datetime = datetime.datetime.fromtimestamp(creation_time_stamp)
		# calculate total avaliable time
		if latest_time < creation_datetime:
			while creation_datetime < datetime.datetime.now():
				num_of_day = creation_datetime.weekday()
				if day_dict[num_of_day] == 1:
					total_hours_avaliable_since_created = total_hours_avaliable_since_created + useable_hours_per_day
				creation_datetime = creation_datetime + datetime.timedelta(days=1)
		else:	
			while creation_datetime < latest_time: 
				# 1,2,3,4,5,6,0
				num_of_day = creation_datetime.weekday()
				if day_dict[num_of_day] == 1:
					total_hours_avaliable_since_created = total_hours_avaliable_since_created + useable_hours_per_day
				creation_datetime = creation_datetime + datetime.timedelta(days=1)
		
		total_hours_used = total_hours_used + row["hours_used"]
	userate = 0
	if total_hours_avaliable_since_created != 0:
		userate = total_hours_used/total_hours_avaliable_since_created
	if userate > 1:
		return 1*100
	return round(userate * 100, 3)

def use_rate_certain_car_space(car_space_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM car_spaces WHERE id = {car_space_id};"
	cur.execute(sql_query)
	record = cur.fetchone()
	total_hours_used = 0
	total_hours_avaliable_since_created = 0
	# cycles through car spaces in postcode

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
	
	creation_time_stamp = record["creation_date"]
	sql_query = f"SELECT * FROM booking WHERE car_space = {car_space_id};"
	cur.execute(sql_query)
	records2 = cur.fetchall()
	# cycles through bookings in car spaces to find latest booking time
	latest_time = datetime.datetime(2022, 5, 15)
	for booking in records2:
		end_time = booking["end_time"]
		date_time_obj_end = datetime.datetime.strptime(end_time, '%Y-%m-%d %H:%M:%S')
		if date_time_obj_end > latest_time:
			latest_time = date_time_obj_end

	creation_datetime = datetime.datetime.fromtimestamp(creation_time_stamp)
	# calculate total avaliable time
	if creation_datetime > latest_time:
		while creation_datetime < datetime.datetime.now(): 
			# 1,2,3,4,5,6,0
			num_of_day = creation_datetime.weekday()
			if day_dict[num_of_day] == 1:
				total_hours_avaliable_since_created = total_hours_avaliable_since_created + useable_hours_per_day
			creation_datetime = creation_datetime + datetime.timedelta(days=1)
	else:
		
		while creation_datetime < latest_time or creation_datetime < datetime.datetime.now(): 
			# 1,2,3,4,5,6,0
			num_of_day = creation_datetime.weekday()
			if day_dict[num_of_day] == 1:
				total_hours_avaliable_since_created = total_hours_avaliable_since_created + useable_hours_per_day
			creation_datetime = creation_datetime + datetime.timedelta(days=1)
		
	total_hours_used = total_hours_used + record["hours_used"]
	userate = 0
	if total_hours_avaliable_since_created != 0:
		userate = total_hours_used/total_hours_avaliable_since_created
	if userate > 1:
		return 1*100
	userate = userate * 100
	return round(userate, 3)

def num_of_booking_and_car_spaces_created(start_time, postcode):
	datetime_string = str(start_time)
	datetime_obj_start = datetime.datetime.strptime(datetime_string, '%Y%m%d')
	datetime_obj_end = datetime.datetime.now()
	
	# calculate num of car spaces created
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM car_spaces WHERE postcode = {postcode};"
	cur.execute(sql_query)
	records = cur.fetchall()
	num_car_spaces_created = 0
	for record in records:
		creation_time_stamp = record['creation_date']
		creation_datetime = datetime.datetime.fromtimestamp(creation_time_stamp)
		if creation_datetime >= datetime_obj_start:
			if creation_datetime <= datetime_obj_end:
				num_car_spaces_created = num_car_spaces_created + 1
	
	# calculate num of bookings created
	sql_query = f"SELECT * FROM booking;"
	cur.execute(sql_query)
	records = cur.fetchall()
	num_bookings_created = 0
	for record in records:
		car_space_id = record["car_space"]
		datetime_string = record["creation_time"]
		creation_datetime = datetime.datetime.strptime(datetime_string, '%Y-%m-%d %H:%M:%S')
		sql_query2 = f"SELECT * FROM car_spaces WHERE id = {car_space_id};"
		cur.execute(sql_query2)
		car_space_record = cur.fetchone()
		if car_space_record is None:
			continue
		pcode = car_space_record["postcode"]
		if pcode == postcode:
			if creation_datetime >= datetime_obj_start:
				if creation_datetime <= datetime_obj_end:
					num_bookings_created = num_bookings_created + 1
	final_dict = {'num_car_spaces': num_car_spaces_created, 'num_bookings': num_bookings_created}
	return final_dict
  