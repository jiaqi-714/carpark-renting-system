import sqlite3 as sl
from datetime import datetime
from zlib import DEF_BUF_SIZE 

from db_dictionary import dict_factory, post_row

global review_id
review_id = 9

# need to add a booking_id field??

def create_review(input):

	global review_id

	input["id"] = review_id
	input["time"] = f"{datetime.now()}"
	input["author"] = input.pop("user_id")
	con = sl.connect('my-test.db')
	post_row(con, "reviews", input)

	review_id = review_id + 1

	con.commit()
	con.close()

	return review_id - 1


# get all reviews in the system
def get_reviews_all():
    con = sl.connect('my-test.db')
    con.row_factory = dict_factory
    cur = con.cursor()
    sql_query = f"SELECT * FROM reviews;"
    cur.execute(sql_query)
    records = cur.fetchall()

    return records

# get all reviews for a listing
def get_reviews_by_listing_id(listing_id):

	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM reviews WHERE car_space = {listing_id};"
	cur.execute(sql_query)
	records = cur.fetchall()
    
	return records

# get all reviews by a specific user
def get_reviews_by_user_id(user_id):

	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM reviews WHERE author = {user_id};"
	cur.execute(sql_query)
	records = cur.fetchall()
	
	return records

# get single review
def get_review_by_review_id(review_id):

	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM reviews WHERE car_space = {review_id};"
	cur.execute(sql_query)
	record = cur.fetchone()
    
	if not record:
		return None

	return record
	
# delete a review from the system
def delete_review(review_id):
	con = sl.connect('my-test.db')
	cur = con.cursor()

	sql_query = f'''SELECT * FROM reviews
		WHERE id = {review_id};'''
	
	cur.execute(sql_query)
	data = cur.fetchall()
	if len(data) == 0:
		return 404

	sql_query = "DELETE FROM reviews WHERE id = ?;"
	cur.execute(sql_query, (review_id,))
	con.commit()

	# check if deleted
	sql_query = f'''SELECT * FROM reviews
		WHERE id = {review_id};'''
	
	cur.execute(sql_query)
	data = cur.fetchall()
	if len(data) != 0:
		return 500

	con.close()

	return 200

# update a review
def update_review(input):
	con = sl.connect('my-test.db')
	cur = con.cursor()

	review_id = input["id"]
	time = f"{datetime.now()}"
	
	sql_query = f"UPDATE reviews SET rating = ?, description = ?, time = ? WHERE id = {review_id}"

	data = [(input["rating"], input["description"], time)]

	cur.executemany(sql_query, (data))

	con.commit()
	con.close()

	return 200


# checks if review belongs to a user
def is_author(review_id, user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM reviews WHERE id = {review_id};"

	cur.execute(sql_query)
	record = cur.fetchone()

	if record["author"] == user_id:
		return True
	
	return False

# check if a review exists
def exists(review_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM reviews WHERE id = {review_id};"

	cur.execute(sql_query)
	record = cur.fetchone()

	if record:
		return True
	
	return False

def already_reviewed(listing_id, user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = f"SELECT * FROM reviews WHERE car_space = {listing_id} AND author = {user_id};"

	cur.execute(sql_query)
	record = cur.fetchone()

	if record:
		return True
	
	return False