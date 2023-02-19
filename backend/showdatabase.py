import sqlite3 as sl

con = sl.connect('my-test.db')

num = 0
while num != 4:

	num = int(input('''please enter: 
					1 for users
					2 for car spaces
					3 for booking
					4 to STOP\n'''))
	if num == 1:
		with con:
			data = con.execute("SELECT * FROM users")
			print('--------------information about users--------------')
			for row in data:
				print(row)
	elif num == 2:
		with con:
			data = con.execute("SELECT * FROM car_spaces")
			print('--------------information about car space--------------')
			for row in data:
				print(row)
	elif num == 3:
		with con:
			data = con.execute("SELECT * FROM booking")
			print('--------------information about booking in system--------------')
			for row in data:
				print(row)