import sqlite3 as sl
import json
import string
import random
import re 
import car_spaces
import booking

from db_dictionary import dict_factory

import smtplib
from email.header import Header
from email.message import EmailMessage
from email.mime.text import MIMEText
import ssl

global user_id 
user_id = 9

tokens = {}
# helper function
def id_generator(size=20, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
	return ''.join(random.choice(chars) for _ in range(size))

def register_user(input):
	global user_id

	password = input['password']

	if not password_check(password):
		return 403

	email = input['email']
	con = sl.connect('my-test.db')

	# email already taken
	if exists_email(email):
		return 400


	name = input['name']


	sql_query = 'INSERT INTO users (id, password, email, is_admin, name, reset_code) values(?, ?, ?, ?, ?, "xxxx")'	
	data = [(user_id, password, email, 0, name)]
	with con:
		con.executemany(sql_query, data)

	token = id_generator()
	tokens[user_id] = token
	user_id = user_id + 1	

	return(token)


def user_login(input):
	email = input['email']
	password = input['password']
	
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = 'SELECT * FROM users WHERE email = ? AND password = ?'
	cur.execute(sql_query, (email, password))
	result = cur.fetchone()
	if result:
		uid = result["id"]
		return(tokens[uid])
	return('invalid password or email')

def user_logout(token):
	for key, value in tokens.items():
		if token == value:
			tokens.pop(key)
			return('user logout success')
	return('user logout failed, invalid token')

def check_user_email(input):
	email = input['email']
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = 'SELECT * FROM users WHERE email = ?'
	cur.execute(sql_query, (email))
	if len(cur.fetchall()) == 1:
		return('email found')
	return('email not found')
	

# Decorator for validating token
def validate_token(token):
	for key, value in tokens.items():
		if token == value:
			return key

	return None


def token_to_ID(input):
	# token = input["token"]
	token = input
	for key, value in tokens.items():
		if token == value:
			con = sl.connect('my-test.db')
			con.row_factory = dict_factory
			cur = con.cursor()
			sql_query = 'SELECT * FROM users WHERE ID = ?'
			cur.execute(sql_query, [key])
			name = cur.fetchone()["name"]
			return name

	return None


def reset_tokens():
	global tokens
	tokens = {}

def dummy_token():
	global tokens
	tokens[1] = "a"
	tokens[2] = "b"
	tokens[3] = "c"
	tokens[4] = "d"
	tokens[5] = "e"
	tokens[6] = "f"
	tokens[7] = "g"

def is_admin(user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f'SELECT * FROM users WHERE id = {user_id};'
	cur.execute(sql_query)
	record = cur.fetchone()
	res = record["is_admin"]
	
	if res:
		return True
	
	return False

def exists(user_id):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = f'SELECT * FROM users WHERE id = {user_id};'
	cur.execute(sql_query)
	record = cur.fetchone()
	if record:
		return True
	
	return False

# Get all info about all users - for admin use
def get_users_all():
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = "SELECT * FROM users;"
	cur.execute(sql_query)
	res = cur.fetchall()

	for user_dict in res:
		user_dict.pop("password")
		
	return res

# Get self user info
def get_user_by_id(user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM users WHERE id = {user_id};"
	cur.execute(sql_query)
	res = cur.fetchone()

	if not res:
		return 404, None

	res.pop("password")
	res.pop("reset_code")

	return 200, res

def update_user_info(input):
	con = sl.connect('my-test.db')
	cur = con.cursor()

	user_id = input["user_id"]
	sql_query = f"SELECT * FROM users WHERE id = {user_id};"
	
	cur.execute(sql_query)
	res = cur.fetchall()
	if len(res) == 0:
		return 404

	user_id = input["user_id"]
	sql_query = f"UPDATE users SET name = ?, email = ? WHERE id = {user_id}"

	data = [(input["name"], input["email"])]

	cur.executemany(sql_query, (data))

	con.commit()
	con.close()

	return 200

def change_password(user_id, input):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	password = input["password"]
	if not password_check(password):
		return 404, 'Password not secure'
	sql_query = f"UPDATE users SET password = '{password}' WHERE id = {user_id}"

	cur.execute(sql_query)

	con.commit()
	con.close()

	return 200

def set_role(user_id, is_admin):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = f"UPDATE users SET is_admin = {is_admin} WHERE id = {user_id}"

	cur.execute(sql_query)
	con.commit()
	con.close()


def delete_user(user_id):
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f"SELECT * FROM users WHERE id = {user_id};"
	
	cur.execute(sql_query)
	res = cur.fetchall()
	if len(res) == 0:
		return 404

	sql_query = "DELETE FROM users WHERE id = ?;"
	cur.execute(sql_query, (user_id,))
	con.commit()

	# check if deleted
	sql_query = f"SELECT * FROM users WHERE id = {user_id};"
	cur.execute(sql_query)
	res = cur.fetchall()
	if len(res) != 0:
		return 500

	sql_query = f"SELECT * FROM car_spaces WHERE owner = {user_id}"
	cur.execute(sql_query)
	records = cur.fetchall()
	for record in records:
		car_spaces.delete_car_space(record['id'], 4)
	
	sql_query = f"SELECT * FROM booking WHERE consumer = {user_id}"
	cur.execute(sql_query)
	records = cur.fetchall()
	for record in records:
		booking.delete_booking(record['id'])
	con.close()

	tokens.pop(user_id)

	return 200


def exists_email(email):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = 'SELECT * FROM users WHERE email = ?'
	cur.execute(sql_query, [email])
	record = cur.fetchone()

	if record:
		return True
	
	return False

# copied fromhttps://stackoverflow.com/a/32542964
def password_check(password):
	"""
	Verify the strength of 'password'
	Returns a dict indicating the wrong criteria
	A password is considered strong if:
		8 characters length or more
		1 digit or more
		1 symbol or more
		1 uppercase letter or more
		1 lowercase letter or more
	"""

	# calculating the length
	length_error = len(password) < 8

	# searching for digits
	digit_error = re.search(r"\d", password) is None

	# searching for uppercase
	uppercase_error = re.search(r"[A-Z]", password) is None

	# searching for lowercase
	lowercase_error = re.search(r"[a-z]", password) is None

	# searching for symbols
	symbol_error = re.search(r"\W", password) is None

	# overall result
	password_ok = not length_error
	#( length_error or digit_error or uppercase_error or lowercase_error or symbol_error )

	return password_ok
	'''
	return {
		'password_ok' : password_ok,
		'length_error' : length_error,
		'digit_error' : digit_error,
		'uppercase_error' : uppercase_error,
		'lowercase_error' : lowercase_error,
		'symbol_error' : symbol_error,
	}
	'''

def rand_str():
	"""
	Generates a randomised password reset string of length 8
	"""
	return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))


# get idea https://www.abstractapi.com/guides/sending-email-with-python
def passwordreset_request(input):
	"""
	Check if email exists and raises InputError if the email is not registered.
	Sends the email of the user a password reset code
	"""
	email = input["email"]
	if not exists_email(email):
		return 400
	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()
	sql_query = f'SELECT * FROM users WHERE email = ?'
	cur.execute(sql_query, [email])
	record = cur.fetchone()
	name = record["name"]

	mail_host = "smtp.163.com"      # SMTP server
	mail_user = "18603820531@163.com"                  # user name
	mail_pass = "wajwaj"               # auth password

	sender = '18603820531@163.com'    # sender email address
	receivers = [f"{email}"]  # receiver

	reset_code = rand_str()
	while exists_reset_code(reset_code):
		reset_code = rand_str()

	content = f'Hello {name}!\n\nYour reset code is {reset_code} \n\nThis email is from Lemongrass'

	message = MIMEText(content, 'plain', 'utf-8')  # content, style, code
	message['From'] = f"jiaqi wang <{mail_user}>"
	message['To'] = ",".join(receivers)
	message['Subject'] = "Password reset email from lemongrass"
 
	try:
		smtpObj = smtplib.SMTP_SSL(mail_host, 465)  # use ssl, port is usually 465
		smtpObj.login(mail_user, mail_pass)  # login auth
		smtpObj.sendmail(sender, receivers, message.as_string())  # send

	except smtplib.SMTPException as e:
		print(e)
	

	sql_query = 	f"""
	UPDATE users
	SET reset_code = '{reset_code}'
	WHERE email = '{email}';
	"""
	cur.execute(sql_query)
	
	con.commit()
	con.close()
	return 200

def passwordreset_valid(input):

	email = input["email"]
	reset_code = input["reset_code"]
	new_password = input["new_password"]

	if not exists_email(email):
		return 400

	if not password_check(new_password):
		return 403

	con = sl.connect('my-test.db')
	con.row_factory = dict_factory
	cur = con.cursor()

	sql_query = 'SELECT * FROM users WHERE email = ?'
	cur.execute(sql_query, [email])
	record = cur.fetchone()
	correct_code = record["reset_code"]
	if (correct_code == reset_code):
		print("valid code")
	else:
		print(f"invalid code, correct code = {correct_code}, your code is {reset_code}")
		return 400
	
	sql_query = 	f"""
	UPDATE users
	SET password = '{new_password}'
	WHERE email = '{email}';
	"""
	cur.execute(sql_query)
	con.commit()
	con.close()

	return 200

# check if reset code is already in database
def exists_reset_code(reset_code):
	con = sl.connect('my-test.db')
	cur = con.cursor()
	sql_query = "SELECT * FROM users WHERE reset_code = (?);"
	cur.execute(sql_query, (reset_code, ))
	record = cur.fetchone()
	if record:
		return True
	
	return False
	