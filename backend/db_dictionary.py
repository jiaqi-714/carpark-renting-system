

# copied from 
# https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.row_factory
# Allows getting db results in dictionary format
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# copied from 
# https://stackoverflow.com/a/31921824
# allows inserting dictionary into db
def post_row(conn, tablename, rec):
    keys = ','.join(rec.keys())
    question_marks = ','.join(list('?'*len(rec)))
    values = tuple(rec.values())
    conn.execute('INSERT INTO '+tablename+' ('+keys+') VALUES ('+question_marks+')', values)
    conn.commit()

# TODO - not tested yet
# can be partial update i.e. PATCH
def update_row(conn, tablename, rec, id_col):

    # empty dictionary
    if len(rec) == 0:
        return

    sql_query = 'UPDATE ' + tablename + ' SET'
    data = []

    for (key, value) in rec.items():
        sql_query = sql_query + ' ' + key + ' = ?,'
        data.append(value)

    sql_query = sql_query.rstrip(",")
    sql_query = sql_query + f' WHERE id = {id_col}'
    print(sql_query)

    data_tuple = tuple(data)

    conn.executemany(sql_query, [data_tuple])
    conn.commit()
    