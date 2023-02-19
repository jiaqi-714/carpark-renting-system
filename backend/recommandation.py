import sqlite3 as sl
import booking
import car_spaces
import random
from db_dictionary import dict_factory
import searchs

"""
sadlkfjslkdf
"""
def recommandation(userid):    
    # find all bookings for the user, and pick one booking randomly, the more one car space is booked the more likely
    # it is getting chosen to be used as center
    # if num_suburb = 0 recommand highest rating and cheapest car spaces
    # if num_suburb >= 1, calculate the score of each car space and return a car space the user have not booked before
    
     
    con = sl.connect('my-test.db')
    con.row_factory = dict_factory
    cur = con.cursor()
    sql_query = f"SELECT * FROM booking WHERE consumer = {userid}"
    cur.execute(sql_query)
    records = cur.fetchall()
    booking_id_history = []
    car_space_been = []
    # get a list of booking ids the user have been to
    for record in records:
        booking_id_history.append(record['id'])
        car_space_been.append(record['car_space'])
    
    if len(booking_id_history) == 0:
        code, real_thing = car_spaces.get_listing_by_id(get_highest_rating_car_space())
        return real_thing
       
    
    else:
        # pick random booking for center
        the_chosen_booking_id = random.choice(booking_id_history)
        (_, booking_record) = booking.get_booking_by_bookingid(the_chosen_booking_id)
        sql_query = f"SELECT * FROM car_spaces WHERE id = {booking_record['car_space']}"
        cur.execute(sql_query)
        car_space_record = cur.fetchone()
        coordinate = car_space_record["coordinates"]
        coordinate_list = coordinate.split()
        chosen_lat = float(coordinate_list[0])
        chosen_lon = float(coordinate_list[1])
        sql_query = f"SELECT * FROM car_spaces"
        cur.execute(sql_query)
        records = cur.fetchall()
        final_score_dict = {}
        for record in records:
            coordinate = record["coordinates"]
            coordinate_list = coordinate.split()
            car_space_lat = float(coordinate_list[0])
            car_space_lon = float(coordinate_list[1])
            distance2 = 0.00
            distance2 = searchs.distance(chosen_lat, car_space_lat, chosen_lon, car_space_lon)
            # 100m = 0.1 rating, 1km = 1 rating
            final_score_dict[record['id']] = (5 - distance2) + get_average_rating_of_car_space_by_car_space_id(record['id'])
        
        final_score_dict = dict(sorted(final_score_dict.items(), key=lambda item: item[1], reverse=True))

        for car_space in final_score_dict:
            if car_space not in car_space_been:
                code, real_thing = car_spaces.get_listing_by_id(car_space)
                return real_thing
        
        return "You have booked every car spaces, no more recommandations for you."
        
'''
Get a random listing, first used to test frontend functionality
'''
def random_listing():
    con = sl.connect('my-test.db')
    con.row_factory = dict_factory
    cur = con.cursor()
    sql_query = "SELECT * FROM car_spaces ORDER BY RANDOM() LIMIT 1;"
    cur.execute(sql_query)
    records = cur.fetchone()

    return records

# return the highest rating car space's id
def get_highest_rating_car_space():
    con = sl.connect('my-test.db')
    con.row_factory = dict_factory
    cur = con.cursor()
    sql_query = f"SELECT * FROM reviews"
    cur.execute(sql_query)
    records = cur.fetchall()
    review_total_dict = {}
    #{car_space_id: [total rating, total num of rating]}
    for record in records:
        rating = record['rating']
        car_space_id = record['car_space']
        if car_space_id in review_total_dict:
            review_total_dict[car_space_id] = [review_total_dict[car_space_id][0] + rating, review_total_dict[car_space_id][1] + 1]
        else:
            review_total_dict[car_space_id] = [rating, 1]
    
    final_dict = {}
    for car_space_id in review_total_dict:
        final_dict[car_space_id] = review_total_dict[car_space_id][0] / review_total_dict[car_space_id][1] 
    
    max_id = 0
    max_rating = -1
    for car_space_id in final_dict:
        if final_dict[car_space_id] > max_rating:
            max_id = car_space_id
            max_rating = final_dict[car_space_id]
            
    return max_id

def get_average_rating_of_car_space_by_car_space_id(car_space_id):
    con = sl.connect('my-test.db')
    con.row_factory = dict_factory
    cur = con.cursor()
    
    sql_query = f"SELECT * FROM reviews WHERE car_space = {car_space_id}"
    cur.execute(sql_query)
    records = cur.fetchall()
    
    total_rating = 0
    total_num_ratings = 0
    for record in records:
        total_rating = total_rating + record['rating']
        total_num_ratings = total_num_ratings + 1
    
   
    if total_num_ratings == 0:
        return 0  
    return round((total_rating / total_num_ratings), 2) 
