from email.policy import default
import sqlalchemy
import os
import requests
import sqlite3
import json


import car_spaces
import booking 
import user
import analysiss
import searchs
import review
import recommandation


from flask import Flask, send_file, request
from flask_cors import CORS
from flask_restx import Api, Resource, fields, inputs, reqparse
from sqlalchemy.types import Integer, String, Date, DateTime

from functools import wraps

import database_setup


global car_space_id 
car_space_id = 9

app = Flask(__name__)
api = Api(app, authorizations={
	'API-KEY': {
		'type': 'apiKey',
		'in': 'header',
		'name': 'Authorization'
	}
},
		security='API-KEY',
		default="Parkr",
		description="A service to lease and book car spaces.")

CORS(app)

parser = api.parser()
parser.add_argument("Authorization", location = "headers", help = "authentication token")


# AUTH
#-------------------------------------------------------------------------
login_model = api.model('User Login', {
	'email':                fields.String,
	'password':             fields.String,
})

user_model = api.model('User', {
	'password':             fields.String,
	'email':                fields.String,
	'name':                 fields.String
})

def requires_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):

		token = request.headers.get('Authorization')

		if not token:
			api.abort(401, 'Authentication token is missing')

		token = token.replace("Bearer ", "")

		#try:
		user_id = user.validate_token(token)
		if not user_id:
			api.abort(403, 'Authentication token is invalid')
		#except Exception as e:
			#api.abort(401, e)

		return f(user_id, *args, **kwargs)

	return decorated

@api.route('/auth/register')
class Users(Resource):

	@api.response(201, 'User registered')
	@api.response(200, 'Successful')
	@api.response(400, 'user email already exist')
	@api.expect(user_model)
	@api.doc(description="Create a new user")
	def post(self):

		data = request.json
		err = user.register_user(data)
		if (err == 400):
			api.abort(400, error="There is already an account with this email")

			return
		
		if (err == 403):
			api.abort(400, error="Password not strong enough")

		token = err
		res = {
			"token": token
		}

		return res

@api.route('/auth/login')
class Users(Resource):

	@api.response(400, 'Invalid password or email')
	@api.response(200, 'Login successful')
	@api.expect(login_model)
	@api.doc(description="Log in")
	def post(self):

		data = request.json

		token = user.user_login(data)
		if token == 'invalid password or email':
			api.abort(400, error="Invalid password or email")
			return

		res = {
			"token": token
		}

		return res

# LISTINGS
#-------------------------------------------------------------------------
listing_model = api.model('Listing', {
	'name':				    fields.String,
	'owner':				fields.Integer,
	'address':			    fields.String,
	'coordinates':		    fields.String,
	'description':		    fields.String,
	'instruction':		    fields.String,
	'price_hourly':		    fields.Integer,
	'price_daily':		    fields.Integer,
	'postcode':			    fields.Integer,
	'photo_link':			fields.String,
	'space_type':			fields.String(default='Driveway'),
	'amenity_24_7':		    fields.Integer,
	'amenity_sheltered':        fields.Integer,
	'amenity_security_gates':   fields.Integer,
	'monday':				    fields.Integer,
	'tuesday':				fields.Integer,
	'wednesday':			    fields.Integer,
	'thursday':			    fields.Integer,
	'friday':				fields.Integer,
	'saturday':			    fields.Integer,
	'sunday':				fields.Integer,
	'starttime': 			fields.Integer,
	'endtime':				fields.Integer,
})

@api.route('/listings')
class Listings(Resource):

	# Get all listings
	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.doc(description="Show all listings")
	def get(self):
		res = car_spaces.get_listings_all()

		if len(res) == 0:
			api.abort(204, "Empty resource")

		return res

@api.route('/listings/new')
class Listings(Resource):

	#Create new listing
	@api.response(404, 'Listing was not found')
	@api.response(201, 'Created')
	@api.response(200, 'Successful')
	@api.expect(parser, listing_model)
	@requires_auth
	@api.doc(description="Create a new listing")
	def post(user_id, self):
		global car_space_id
		id = car_space_id

		listing = request.json
		listing["user_id"] = user_id
		listing["listing_id"] = id
		car_spaces.create_car_space(listing)

		res = {
			"listingID": car_space_id
		}

		car_space_id = car_space_id + 1

		return res
	
@api.route('/listings/<int:id>')
class ListingIds(Resource):

	# Get a specific listing
	@api.response(404, 'Listing was not found')
	@api.response(200, 'OK')
	@api.doc(description="View a listing by its ID")
	def get(self, id):

		code, res = car_spaces.get_listing_by_id(id)

		if code == 404:
			api.abort(404, f"Car space {id} doesn't exist")

		return res

	# Update a listing
	@api.response(404, 'Listing was not found')
	@api.response(200, 'OK')
	@api.expect(parser, listing_model) # Update Model
	@api.doc(description="Update a particular listing")
	@requires_auth
	def put(user_id, self, id):

		# check if user_id is the owner or if they are admin
		if not (user.is_admin(user_id) or car_spaces.is_owner(id, user_id)):
			api.abort(403, 'Permission denied')

		data = request.json

		data["user_id"] = user_id
		data["listing_id"] = id
		car_spaces.create_car_space(data)


		return f"Car space with id {id} successfully updated", 200
	
	# Delete a listing
	@api.response(404, 'Listing was not found')
	@api.response(200, 'Successful')
	@api.expect(parser)
	@api.doc(description="Delete a listing by its ID")
	@requires_auth
	def delete(user_id, self, id):
		# check if user_id is the owner or if they are admin
		if not (user.is_admin(user_id) or car_spaces.is_owner(id, user_id)):
			api.abort(403, 'Permission denied')

		code = car_spaces.delete_car_space(id, user_id)
		
		if code == 404:
			api.abort(404, f"Car space {id} doesn't exist")
		
		if code == 500:
			api.abort(500, f"Car space {id} was unable to be deleted")
		
		if code == 200:
			return f"Car space with id {id} successfully removed", 200

# REVIEWS
#-------------------------------------------------------------------------
review_model = api.model('Review', {
	'rating':		    	fields.Integer,
	'description':			fields.String,
})

@api.route('/reviews')
class Reviews (Resource):
	# get all reviews - for admin use
	@api.response(404, 'Page not found')
	@api.response(403, 'Forbidden')
	@api.response(200, 'Successful')
	@api.doc(description="Get all reviews")
	@api.expect(parser)
	@requires_auth
	def get(user_id, self):

		if not user.is_admin(user_id):
			api.abort(403, 'Permission denied')
		
		res = review.get_reviews_all()

		if len(res) == 0:
			api.abort(204, "Empty resource")
	
		return res
	

@api.route('/reviews/listings/<int:id>')
class Reviews (Resource):

	# get reviews for a specific listing
	@api.response(404, 'Listing not found')
	@api.response(200, 'Successful')
	@api.doc(description="Get reviews for a specific listing")
	def get(self, id):

		if not car_spaces.exists(id):
			api.abort(404, 'Car space does not exist')

		res = review.get_reviews_by_listing_id(id)

		if len(res) == 0:
			api.abort(204, "Empty resource")

		return res, 200

	# Create a review for a listing
	@api.response(404, 'Page not found')	
	@api.response(403, 'Forbidden')
	@api.response(201, 'Created')
	@api.response(200, 'Successful')
	@api.doc(description="Create a review for a listing")
	@api.expect(parser, review_model)
	@requires_auth
	def post(user_id, self, id):

		if not car_spaces.exists(id):
			api.abort(404, 'Car space does not exist')

		if review.already_reviewed(id, user_id):
			api.abort(403, 'Car space already reviewed by user')

		data = request.json
		data["user_id"] = user_id
		data["car_space"] = id
		new_id = review.create_review(data)

		if not new_id:
			api.abort(500, 'Unable to create review')

		res = {
			"review_id": new_id
		}

		return res

# get all reviews made by a user
@api.route('/reviews/users/<int:id>')
class Reviews (Resource):
	@api.response(404, 'User not found')
	@api.response(200, 'Successful')
	@api.doc(description="Get all reviews created by a user")
	@api.expect(parser)
	@requires_auth
	def get(user_id, self, id):

		if not user.exists(id):
			api.abort(404, 'User does not exist')

		res = review.get_reviews_by_user_id(id)

		if len(res) == 0:
			api.abort(204, "Empty resource")
		
		return res, 200

@api.route('/reviews/<int:id>')
class ReviewIDs (Resource):
	# get a specific review
	@api.response(404, 'User not found')
	@api.response(200, 'Successful')
	@api.doc(description="Get a specific review")
	def get(self, id):

		res = review.get_review_by_review_id(id)

		if not res:
			api.abort(404, 'Review does not exist')

		return res, 200

	# Update a review
	@api.response(404, 'Review was not found')
	@api.response(200, 'OK')
	@api.expect(parser, review_model) # Update Model
	@api.doc(description="Update a particular review")
	@requires_auth
	def put(user_id, self, id):
		# check if user_id is the owner or if they are admin
		if not (user.is_admin(user_id) or review.is_author(id, user_id)):
			api.abort(403, 'Permission denied')
		
		if not review.exists(id):
			api.abort(404, 'Review does not exist')

		data = request.json
		data["id"] = id

		review.update_review(data)

		return f"Updated review {id}", 200


	# Delete a review
	@api.response(404, 'Review was not found')
	@api.response(200, 'Successful')
	@api.expect(parser)
	@api.doc(description="Delete a review by its ID")
	@requires_auth
	def delete(user_id, self, id):
		if not review.exists(id):
			api.abort(404, f"Review {id} doesn't exist")

		# check if user_id is the owner or if they are admin
		if not (user.is_admin(user_id) or review.is_author(id, user_id)):
			api.abort(403, 'Permission denied')

		code = review.delete_review(id)
						
		if code == 500:
			api.abort(500, f"Review  with id {id} was unable to be deleted")
		
		if code == 200:
			return f"Review with id {id} successfully removed", 200


# BOOKINGS
#-------------------------------------------------------------------------

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

booking_model = api.model('booking', {
	'car_space':			fields.Integer,
	'start_time':		    fields.String(default='2022-07-13 01:00:00'),
	'end_time':		    	fields.String(default='2022-07-14 01:00:00'),
	'price':		    	fields.Integer,
	'status':		    	fields.String(default='Pending'),
	'creation_time':		fields.String,
	'car_type':			    fields.Integer,
	'car_registration':		fields.String,
	'total_hours':          fields.Integer
})


@api.route('/bookings')
class Bookings(Resource):
	# Show all bookings
	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.expect(parser)
	@api.doc(description="Show all bookings")
	@requires_auth
	def get(user_id, self):

		if user.is_admin(user_id):
			(code, res) = booking.get_all_bookings()
		else:
			(code, res) = booking.get_bookings_by_userid(user_id)

		if len(res) == 0:
			api.abort(204, "Empty resource")

		return res

@api.route('/bookings/new')
class Bookings(Resource):
	# Create a new booking
	@api.response(404, 'Page not found')
	@api.response(201, 'Created')
	@api.response(200, 'Successful')
	@api.expect(parser, booking_model)
	@requires_auth
	@api.doc(description="Create a new booking")
	def post(user_id, self):

		data = request.json
		data["user_id"] = user_id
		
		car_space = data["car_space"]
		start_time = data["start_time"]
		end_time = data["end_time"]

		if not car_spaces.is_valid_time(car_space, start_time, end_time):
			api.abort(400, 'Invalid start and end time')

		new_id = booking.create_booking(data)

		if not new_id:
			api.abort(500, 'Unable to create booking')

		res = {
			"booking_id": new_id
		}

		return res
	

@api.route('/bookings/user/<int:id>')
class BookingIds(Resource):

	@api.response(404, 'Page not found')
	@api.response(201, 'Successful')
	@api.response(200, 'Show booking by id')
	@api.doc(description="View bookings by a user")
	def get(self, id):

		code, res = booking.get_bookings_by_userid(id)

		if code == 404:
			api.abort(404, f"This user id {id} doesn't exist")

		return res

@api.route('/bookings/listing/<int:id>')
class BookingIds(Resource):

	@api.response(404, 'Page not found')
	@api.response(201, 'Successful')
	@api.response(200, 'Show booking by id')
	@api.param("valid", "Whether to show only valid non-expired bookings")
	@api.doc(description="View bookings for a listing")
	def get(self, id):

		valid = request.args.get('valid')

		if valid in ["1", "true", "True"]:
			code, res = booking.get_valid_bookings_by_listingid(id)
		else:
			code, res = booking.get_bookings_by_listingid(id)

		if code == 404:
			api.abort(404, f"This listing id {id} doesn't exist")

		if len(res) == 0:
			api.abort(204, "Empty resource")

		return res

@api.route('/bookings/booking/<int:id>')
class BookingIds(Resource):

	@api.response(404, 'Page not found')
	@api.response(201, 'Successful')
	@api.response(200, 'Show booking by id')
	@api.doc(description="View a booking by its user id")
	def get(self, id):

		code, res = booking.get_booking_by_bookingid(id)

		if code == 404:
			api.abort(404, f"This booking id {id} doesn't exist")

		return res

#booking_parser = api.parser()
#booking_parser.add_argument("status", type=str)

@api.route('/bookings/<int:id>') 
class BookingIds(Resource):

	# Update a booking by ID
	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.expect(parser, booking_model)
	@requires_auth
	@api.doc(description="Update a booking by its ID")
	def put(user_id, self, id):

		if not (user.is_admin(user_id) or booking.is_booker(id, user_id)):
			api.abort(403, 'Permission denied')

		data = request.json
		data["booking_id"] = id

		code = booking.update_booking(data)

		if code == 404:
			api.abort(404, f"Booking {id} doesn't exist")

		if code == 200:
			return f"Booking with id {id} successfully updated", 200


	# Delete a booking by ID
	@api.response(404, 'Booking was not found')
	@api.response(200, 'Successful')
	@api.expect(parser)
	@requires_auth
	@api.doc(description="Delete a booking by its ID")
	def delete(user_id, self, id):
		if not (user.is_admin(user_id) or booking.is_booker(id, user_id)):
			api.abort(403, 'Permission denied')

		res = booking.delete_booking(id)
		
		if res == 404:
			api.abort(404, f"Booking {id} doesn't exist")

		if res == 200:
			return f"Booking with id {id} successfully removed", 200

# ANALYSIS
#-------------------------------------------------------------------------
@api.route('/analysis/price/<int:postcode>')
class analysis(Resource):

	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.doc(description="Return average price in suburb")
	def get(self, postcode):
		user_id = 1 # TODO get id from token

		#if is_admin(user_id):

		code, res = analysiss.average_price_in_suburb(postcode)
		if code == 404:
			return f'error'
		return res

@api.route('/analysis/suburb/userate/<int:postcode>')
class analysis(Resource):

	#@api.response(404, 'Page not found')
	#@api.response(200, 'Successful')
	#@api.doc(description="Show all listings")
	def get(self, postcode):
		user_id = 1 # TODO get id from token

		#if is_admin(user_id):

		res = analysiss.average_use_rate_in_suburb(postcode)
		if not res:
			api.abort(404, "No analysis")

		return res, 200

@api.route('/analysis/id/userate/<int:car_space_id>')
class analysis(Resource):

	#@api.response(404, 'Page not found')
	#@api.response(200, 'Successful')
	#@api.doc(description="Show all listings")
	def get(self, car_space_id):
		user_id = 1 # TODO get id from token

		#if is_admin(user_id):

		res = analysiss.use_rate_certain_car_space(car_space_id)
		
		if not res:
			api.abort(404, "No analysis")


		return res

@api.route('/analysis/suburb/usage/<int:postcode>/<int:start_time>')
class analysis(Resource):

	#@api.response(404, 'Page not found')
	#@api.response(200, 'Successful')
	#@api.doc(description="Show all listings")
	def get(self, postcode, start_time):
		res = analysiss.num_of_booking_and_car_spaces_created(start_time, postcode)

		if not res:
			api.abort(404, "No analysis")

		return res

# SEARCH
#-------------------------------------------------------------------------
search_model = api.model('search', {	
	"latitude":             	fields.Float(default=-33.907066),
	"longtitude":           	fields.Float(default=151.2365421),
	"amenity_24_7":         	fields.Integer(default = 0),
	"amenity_sheltered":    	fields.Integer(default= 0),
	"amenity_security_gates":   fields.Integer(default = 0),
	"starttime":            	fields.String(default='2022-07-13 01:00:00'),
	"endtime":              	fields.String(default='2022-07-18 01:00:00'),
	"min_daily_price":          fields.Integer(default = 0),
	"max_daily_price":			fields.Integer(default = 99),
	"type_of_space":            fields.String(default = 'Driveway'),
	"max_distance":				fields.Integer(default = 10),
	"sort_by":					fields.Integer(default = 0), # 0 means that sort by distance, 1 means sort by houly price, 2 means sort by daily price 
})

@api.route('/search')
class search(Resource):
	@api.expect(parser, search_model)
	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.doc(description="Show all listings by filter order by distance")
	def post(self):
		user_id = 1 # TODO get id from token

		#if is_admin(user_id):
		data = request.json
		res = searchs.search_by_distance(data)

		return res

search_all_model = api.model('search/all', {	
	"latitude":             	fields.Float(default=-33.907066),
	"longtitude":           	fields.Float(default=151.2365421),
	"starttime":            	fields.String(default='2022-07-13 01:00:00'),
	"endtime":              	fields.String(default='2022-07-18 01:00:00'),
	"max_distance":				fields.Integer(default = 10),
	"sort_by":					fields.Integer(default = 0), # 0 means that sort by distance, 1 means sort by houly price, 2 means sort by daily price 
})

@api.route('/search/all')
class search(Resource):
	@api.expect(parser, search_all_model)
	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.doc(description="Show all listings by filter order by distance")
	def post(self):
		user_id = 1 # TODO get id from token

		#if is_admin(user_id):
		data = request.json
		res = searchs.search_all(data)

		return res

# USERS
#-------------------------------------------------------------------------

# Get all info about all users - for admin use
@api.route('/users')
class Users(Resource):
	@api.response(404, 'Page not found')
	@api.response(403, 'Forbidden')
	@api.response(200, 'Successful')
	@api.doc(description="Get all users information")
	@api.expect(parser)
	@requires_auth
	def get(user_id, self):

		if not user.is_admin(user_id):
			api.abort(403, 'Permission denied')
		
		res = user.get_users_all()

		if len(res) == 0:
			api.abort(204, "Empty resource")

		return res

# Get self id from token
@api.route('/user/selfID')
class Users(Resource):
	@api.expect(parser)
	@requires_auth
	def get(user_id, self):


		return {
			"user_id": user_id
		}


@api.route('/admin')
class Users(Resource):

	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	#@api.doc(description="Return average price in suburb")
	@api.expect(parser)
	@requires_auth
	def get(user_id, self):
	
		res = user.is_admin(user_id)

		if not res:
			api.abort(500, "Server Error")

		return {'is_admin': f'{res}'}

@api.route('/users/<int:id>')
class UserIDs(Resource):
	@api.response(404, 'User not found')
	@api.response(200, 'Successful')
	@api.doc(description="Get user information by ID")
	@api.expect(parser)
	@requires_auth
	# Get info for a specific user
	# user_id is needed for authentication, id is the user we are searching up
	def get(user_id, self, id):

		# accessing info for a different user
		if user_id != id:
			if not user.is_admin(user_id):
				api.abort(403, 'Permission denied')

		code, res = user.get_user_by_id(id)
		if code == 404:
			api.abort(404, f"User {id} doesn't exist")

		return res

	# Update user info
	@api.response(404, 'User was not found')
	@api.response(200, 'OK')
	@api.expect(parser, user_model)
	@api.doc(description="Update User info by ID")
	@requires_auth
	def put(user_id, self, id):

		# accessing info for a different user
		if user_id != id:
			if not user.is_admin(user_id):
				api.abort(403, 'Permission denied')

		data = request.json
		data["user_id"] = id

		code = user.update_user_info(data)
		if code == 404:
			api.abort(404, f"User {id} doesn't exist")

		return f"Updated information for user {id}", 200
	
	@api.response(404, 'User was not found')
	@api.response(200, 'Successful')
	@api.expect(parser)
	@api.doc(description="Delete a user by their ID")

	@requires_auth
	def delete(user_id, self, id):

		# accessing info for a different user
		if user_id != id:
			if not user.is_admin(user_id):
				api.abort(403, 'Permission denied')


		code = user.delete_user(id)

		if code == 404:
			api.abort(404, f"User {id} doesn't exist")
		elif code == 500:
			api.abort(500, f"User {id} was unable to be deleted")
		
		else:
			return f"Successfully deleted user {id}", 200
			
set_role_model = api.model('set role', {	
	"target_user":             	fields.Integer,
	"set_admin":           		fields.Integer(default = 0)
})

@api.route('/users/set-role')
class UserIDs(Resource):
	@api.response(404, 'User not found')
	@api.response(200, 'Successful')
	@api.doc(description="Change a user's role")
	@api.expect(parser, set_role_model)
	@requires_auth
	# Get info for a specific user
	def put(user_id, self):

		# must be admin
		if not user.is_admin(user_id):
			api.abort(403, 'Permission denied')

		data = request.json
		target_user = data['target_user']
		set_admin = data['set_admin']

		if not user.exists(target_user):
			api.abort(404, f"User {id} doesn't exist")

		user.set_role(target_user, set_admin)

		if set_admin:
			return f"Successfully gave admin role to user {user_id}", 200
		else:
			return f"Successfully removed admin role from user {user_id}", 200

@api.route('/password')
class Users(Resource):
	@api.response(404, 'User was not found')
	@api.response(200, 'OK')
	#@api.expect(parser, user_model)
	#@api.doc(description="Update User info by ID")
	@requires_auth
	def put(user_id, self):
		data = request.json
		code = user.change_password(user_id, data)
		if code == 404:
			api.abort(404, f"User {id} doesn't exist")
		return f"Updated information for user {id}", 200

@api.route('/token_to_ID')
class Users(Resource):
	
	@api.response(400, 'Invalid password or email')
	@api.response(200, 'Login successful')
	@api.doc(description="Get username from token")
	@api.expect(parser)
	def post(self):

		bearer = request.headers.get('Authorization')
		token = bearer.replace("Bearer ", "")
		name = user.token_to_ID(token)

		res = {
			"name": name
		}

		if name:
			return res, 200

		return res, 400


#-------------------------------------------------------------------------

@api.route('/listings/user')
class listings(Resource):

	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	#@api.doc(description="Return average price in suburb")
	@api.expect(parser)	
	@requires_auth
	def get(user_id, self):
	
		code, res = car_spaces.get_listing_by_userid(user_id)
		if code == 404:
			return f'error'
		return res

@api.route('/bookings/user')
class bookings(Resource):

	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	#@api.doc(description="Return average price in suburb")
	@api.expect(parser)	
	@requires_auth
	def get(user_id, self):
		code, res = booking.get_bookings_by_userid(user_id)
		if code == 404:
			return f'error'
		return res

@api.route('/recommendation')
class Recommendation (Resource):

	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.expect(parser)
	@requires_auth
	def get(user_id, self):

		res = recommandation.recommandation(user_id)

		return res
		
#----------------------------
resetPassword_send = api.model('/resetPassword/send', {	
	"email":             	fields.String(default="875986101@qq.com"),
})

@api.route('/resetPassword/send')
class bookings(Resource):

	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.expect(parser, resetPassword_send)
	def post(self):

		data = request.json
		res = user.passwordreset_request(data)
		return res

resetPassword_valid = api.model('/resetPassword/valid', {	
	"email":             	fields.String(default="875986101@qq.com"),
	"reset_code":			fields.String(default="12345678"),
	"new_password":			fields.String(default="12345678"),
})

@api.route('/resetPassword/valid')
class bookings(Resource):

	@api.response(404, 'Page not found')
	@api.response(200, 'Successful')
	@api.expect(parser, resetPassword_valid)
	def post(self):
		
		data = request.json
		res = user.passwordreset_valid(data)
		return res


if __name__ == '__main__':
	user.dummy_token()
	app.run(debug=True, port=5000)
