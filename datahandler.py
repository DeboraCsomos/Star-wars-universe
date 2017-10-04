from config import Config
import psycopg2
import psycopg2.extras
from flask import Flask, render_template, redirect, request, session, url_for
import bcrypt


def open_database():
    try:
        connection_string = Config.DB_CONNECTION_STR
        connection = psycopg2.connect(connection_string)
        connection.autocommit = True
    except psycopg2.DatabaseError as exception:
        print(exception)
    return connection


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = open_database()
        # we set the cursor_factory parameter to return with a dict cursor (cursor which provide dictionaries)
        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()
        return ret_value
    return wrapper


@connection_handler
def check_and_register_user(cursor, username, password):
    cursor.execute("SELECT username FROM users;")
    all_users = cursor.fetchall()
    existing_usernames = []
    for user in all_users:
        existing_usernames.append(user["username"])
    if username in existing_usernames:
        return False
    cursor.execute("""INSERT INTO users (username, password)
                   VALUES(%(username)s, %(password)s);
                   """, {'username': username, 'password': password})
    return True


@connection_handler
def get_user_by_username(cursor, username):
    cursor.execute("""
                   SELECT username, password, id
                   FROM users
                   WHERE username = %s;
                   """, (username,))
    return cursor.fetchone()


def get_hashed_password(plain_text_password):
    # Hash a password for the first time
    #   (Using bcrypt, the salt is saved into the hash itself)
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode("utf-8")


def check_password(plain_text_password, hashed_text_password):
    hashed_bytes_password = hashed_text_password.encode("utf-8")
    # Check hased password. Useing bcrypt, the salt is saved into the hash itself
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)
