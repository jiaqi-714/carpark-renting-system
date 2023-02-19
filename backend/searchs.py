from cgi import print_exception
import sqlite3 as sl
import datetime 
from math import radians, cos, sin, asin, sqrt
from db_dictionary import dict_factory


def distance(lat1, lat2, lon1, lon2):
	 
	# The math module contains a function named
	# radians which converts from degrees to radians.
	lon1 = radians(lon1)
	lon2 = radians(lon2)
	lat1 = radians(lat1)
	lat2 = radians(lat2)
	  
	# Haversine formula
	dlon = lon2 - lon1
	dlat = lat2 - lat1
	a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
 
	c = 2 * asin(sqrt(a))
	
	# Radius of earth in kilometers. Use 3956 for miles
	r = 6371
	  
	# calculate the result in km
	return(c * r)



def search_by_distance(input):

	debug = 0

	user_lat = float(input["latitude"])
	user_lon = float(input["longtitude"])
	user_amenity_24_7 = input["amenity_24_7"]
	user_amenity_sheltered = input["amenity_sheltered"]
	user_amenity_security_gates = input["amenity_security_gates"]
	s1_user_starttime = datetime.datetime.strptime(input["starttime"], '%Y-%m-%d %H:%M:%S')
	e1_user_endtime = datetime.datetime.strptime(input["endtime"], '%Y-%m-%d %H:%M:%S')
	# Javascript date: 0 represents Sunday
	start_week_day = (s1_user_starttime.weekday() + 1) % 7
	end_week_day = (e1_user_endtime.weekday() + 1) % 7
	user_min_daily_price = input["min_daily_price"]
	user_max_daily_price = input["max_daily_price"]
	user_type_of_space = input["type_of_space"]
	max_distance = input["max_distance"]
	sort_by = input["sort_by"]
	# 0 means that sort by distance, 1 means sort by houly price, 2 means sort by daily price 

	search_radius_km = max_distance
	con = sl.connect('my-test.db')

	con.row_factory = dict_factory

	cur = con.cursor()
	sql_query = "SELECT * FROM car_spaces"
	cur.execute(sql_query)
	records = cur.fetchall()
	distance_from_user_dict = {}
	for record in records:
		coordinate = record["coordinates"]
		coordinate_list = coordinate.split()
		car_space_latitude = float(coordinate_list[0])
		car_space_longtitude = float(coordinate_list[1])
		distance2 = 0.00
		distance2 = distance(user_lat, car_space_latitude, user_lon, car_space_longtitude)
		if distance2 <= search_radius_km:
			distance_from_user_dict[record["id"]] = distance2
	   
	distance_from_user_dict2 = {}
	distance_from_user_dict2 = dict(sorted(distance_from_user_dict.items(), key=lambda item: item[1]))

	
   
	res = []

	for key in distance_from_user_dict2:
		
		sql_query = f"SELECT * FROM car_spaces where id = {key}"
		cur.execute(sql_query)
		record = cur.fetchone()
		day_dict = {}
		day_dict[1] = record["monday"]
		day_dict[2] = record["tuesday"]
		day_dict[3] = record["wednesday"]
		day_dict[4] = record["thursday"]
		day_dict[5] = record["friday"]
		day_dict[6] = record["saturday"]
		day_dict[0] = record["sunday"]

		carstarttime = record["starttime"]
		carendtime = record["endtime"]
		userstarttime = s1_user_starttime.hour
		userendtime = e1_user_endtime.hour
		if userendtime == 0:
			userendtime = 24
		# print(f"input start time = {s1_user_starttime.hour}, current car space start time: {carstarttime}, input end time = {e1_user_endtime.hour}, current car space stop time:{carendtime}")
		if userstarttime < record["starttime"] or userendtime > record["endtime"]:
			continue


		if day_dict[start_week_day] == 0:
			continue
		if day_dict[end_week_day] == 0:
			continue
		# record 12-14 = amenities
		if record["amenity_24_7"] == 0 and user_amenity_24_7 == 1:
			if debug: print(f"delete in line 73 for car space id {key}")
			continue
		if record["amenity_sheltered"] == 0 and user_amenity_sheltered == 1:
			if debug:print(f"delete in line 76 for car space id {key}")
			continue
		if record["amenity_security_gates"] == 0 and user_amenity_security_gates == 1:
			if debug:print(f"delete in line 79 for car space id {key}")
			continue
		
		if user_min_daily_price > record["price_hourly"]:
			if debug:print(f"delete in line 83 for car space id {key}")
			continue
		if user_max_daily_price < record["price_daily"]:
			if debug:print(f"delete in line 86 for car space id {key}")
			continue

		if user_type_of_space != record["space_type"]:
			if debug:print(f"delete in line 90 for car space id {key}")
			continue
		
		sql_query = f"SELECT * FROM booking where car_space = {key}"
		cur.execute(sql_query)
		records2 = cur.fetchall()
		
		success = 0
		time_conflict = 0
		for record2 in records2:
			s2_booking_start_time = datetime.datetime.strptime(record2["start_time"], '%Y-%m-%d %H:%M:%S')
			e2_booking_end_time = datetime.datetime.strptime(record2["end_time"], '%Y-%m-%d %H:%M:%S')

			if debug:print(f"search starttime = {s1_user_starttime}, search endtime = {e1_user_endtime}, booking start time = {s2_booking_start_time}, booking enttime = {e2_booking_end_time}")

			bid = record2["id"]
			if debug:print(f"test this booking {bid} is with car space id {key}...")
			if s1_user_starttime < s2_booking_start_time and s1_user_starttime < e2_booking_end_time and e1_user_endtime < s2_booking_start_time and e1_user_endtime < e2_booking_end_time:
				success = success + 1
			elif s1_user_starttime > s2_booking_start_time and s1_user_starttime > e2_booking_end_time and e1_user_endtime > s2_booking_start_time and e1_user_endtime > e2_booking_end_time:
				if debug:print(f"this booking {bid} is not effect car space id {key}")
				success = success + 1
			else:
				time_conflict = 1
				break
		if (time_conflict) == 1:
			if debug:print(f"delete car space id {key} due to time confilct")
			continue

		listing = {}
		listing["id"] = record["id"]
		listing["name"] = record["name"]
		listing["owner"] = record["owner"]
		listing["address"] = record["address"]
		listing["coordinates"] = record["coordinates"]
		listing["description"] = record["description"]
		listing["instruction"] = record["instruction"]
		listing["price_hourly"] = record["price_hourly"]
		listing["price_daily"] = record["price_daily"]
		listing["postcode"] = record["postcode"]
		listing["photo_link"] = record["photo_link"]
		listing["space_type"] = record["space_type"]
		listing["amenity_24_7"] = record["amenity_24_7"]
		listing["amenity_sheltered"] = record["amenity_sheltered"]
		listing["amenity_security_gates"] = record["amenity_security_gates"]
		listing["monday"] = record["monday"]
		listing["tuesday"] = record["tuesday"]
		listing["wednesday"] = record["wednesday"]
		listing["thursday"] = record["thursday"]
		listing["friday"] = record["friday"]
		listing["saturday"] = record["saturday"]
		listing["sunday"] = record["sunday"]
		listing["starttime"] = record["starttime"]
		listing["endtime"] = record["endtime"]
		listing['creation_date'] = record['creation_date']
		listing['hours_used'] = record['hours_used']
		listing['distance_to_user'] = distance_from_user_dict2[key]
		res.append(listing)

	if (sort_by == 0):
		newlist = sorted(res, key=lambda d: d['distance_to_user']) 
	elif (sort_by == 1):
		newlist = sorted(res, key=lambda d: d['price_hourly'])
	else:
		newlist = sorted(res, key=lambda d: d['price_daily'])

	return newlist
	
# ------------------------

def search_all(input):

	debug = 0

	user_lat = float(input["latitude"])
	user_lon = float(input["longtitude"])
	s1_user_starttime = datetime.datetime.strptime(input["starttime"], '%Y-%m-%d %H:%M:%S')
	e1_user_endtime = datetime.datetime.strptime(input["endtime"], '%Y-%m-%d %H:%M:%S')
	# Javascript date: 0 represents Sunday
	start_week_day = (s1_user_starttime.weekday() + 1) % 7
	end_week_day = (e1_user_endtime.weekday() + 1) % 7
	max_distance = input["max_distance"]
	sort_by = input["sort_by"]

	search_radius_km = max_distance
	con = sl.connect('my-test.db')

	con.row_factory = dict_factory

	cur = con.cursor()
	sql_query = "SELECT * FROM car_spaces"
	cur.execute(sql_query)
	records = cur.fetchall()
	distance_from_user_dict = {}
	for record in records:
		coordinate = record["coordinates"]
		coordinate_list = coordinate.split()
		car_space_latitude = float(coordinate_list[0])
		car_space_longtitude = float(coordinate_list[1])
		distance2 = 0.00
		distance2 = distance(user_lat, car_space_latitude, user_lon, car_space_longtitude)
		if distance2 <= search_radius_km:
			distance_from_user_dict[record["id"]] = distance2
	   
	distance_from_user_dict2 = {}
	distance_from_user_dict2 = dict(sorted(distance_from_user_dict.items(), key=lambda item: item[1]))

	
   
	res = []

	for key in distance_from_user_dict2:
		
		sql_query = f"SELECT * FROM car_spaces where id = {key}"
		cur.execute(sql_query)
		record = cur.fetchone()
		day_dict = {}
		day_dict[1] = record["monday"]
		day_dict[2] = record["tuesday"]
		day_dict[3] = record["wednesday"]
		day_dict[4] = record["thursday"]
		day_dict[5] = record["friday"]
		day_dict[6] = record["saturday"]
		day_dict[0] = record["sunday"]

		# car space               
		carstarttime = record["starttime"]
		carendtime = record["endtime"]
		userstarttime = s1_user_starttime.hour
		userendtime = e1_user_endtime.hour
		if userendtime == 0:
			userendtime = 24
		# print(f"input start time = {s1_user_starttime.hour}, current car space start time: {carstarttime}, input end time = {e1_user_endtime.hour}, current car space stop time:{carendtime}")
		if userstarttime < record["starttime"] or userendtime > record["endtime"]:
			if debug:print(f"delete car space id {key} due to starttime and endtime thing")
			continue

		if day_dict[start_week_day] == 0:
			if debug:print(f"delete car space id {key} due to start day")
			continue
		if day_dict[end_week_day] == 0:
			if debug:print(f"delete car space id {key} due to end day")
			continue
		
		sql_query = f"SELECT * FROM booking where car_space = {key}"
		cur.execute(sql_query)
		records2 = cur.fetchall()
		
		success = 0
		time_conflict = 0
		for record2 in records2:
			s2_booking_start_time = datetime.datetime.strptime(record2["start_time"], '%Y-%m-%d %H:%M:%S')
			e2_booking_end_time = datetime.datetime.strptime(record2["end_time"], '%Y-%m-%d %H:%M:%S')

			bid = record2["id"]
			if debug:print(f"booking id = {bid} search starttime = {s1_user_starttime}, search endtime = {e1_user_endtime}, booking start time = {s2_booking_start_time}, booking enttime = {e2_booking_end_time}")

			if debug:print(f"test this booking {bid} is with car space id {key}...")
			if s1_user_starttime < s2_booking_start_time and s1_user_starttime < e2_booking_end_time and e1_user_endtime < s2_booking_start_time and e1_user_endtime < e2_booking_end_time:
				success = success + 1
				if debug:print(f"pass booking {bid} is with car space id {key} 111...")
			elif s1_user_starttime > s2_booking_start_time and s1_user_starttime > e2_booking_end_time and e1_user_endtime > s2_booking_start_time and e1_user_endtime > e2_booking_end_time:
				if debug:print(f"pass booking {bid} is with car space id {key} 222...")
				if debug:print(f"this booking {bid} is not effect car space id {key}")
				success = success + 1
			else:
				time_conflict = 1
				break
		if (time_conflict) == 1:
			if debug:print(f"delete car space id {key} due to time confilct")
			continue

		listing = {}
		listing["id"] = record["id"]
		listing["name"] = record["name"]
		listing["owner"] = record["owner"]
		listing["address"] = record["address"]
		listing["coordinates"] = record["coordinates"]
		listing["description"] = record["description"]
		listing["instruction"] = record["instruction"]
		listing["price_hourly"] = record["price_hourly"]
		listing["price_daily"] = record["price_daily"]
		listing["postcode"] = record["postcode"]
		listing["photo_link"] = record["photo_link"]
		listing["space_type"] = record["space_type"]
		listing["amenity_24_7"] = record["amenity_24_7"]
		listing["amenity_sheltered"] = record["amenity_sheltered"]
		listing["amenity_security_gates"] = record["amenity_security_gates"]
		listing["monday"] = record["monday"]
		listing["tuesday"] = record["tuesday"]
		listing["wednesday"] = record["wednesday"]
		listing["thursday"] = record["thursday"]
		listing["friday"] = record["friday"]
		listing["saturday"] = record["saturday"]
		listing["sunday"] = record["sunday"]
		listing["starttime"] = record["starttime"]
		listing["endtime"] = record["endtime"]
		listing['creation_date'] = record['creation_date']
		listing['hours_used'] = record['hours_used']
		listing['distance_to_user'] = distance_from_user_dict2[key]
		res.append(listing)

	if (sort_by == 0):
		newlist = sorted(res, key=lambda d: d['distance_to_user']) 
	elif (sort_by == 1):
		newlist = sorted(res, key=lambda d: d['price_hourly'])
	else:
		newlist = sorted(res, key=lambda d: d['price_daily'])

	return newlist

	
