from flask import Flask, session, url_for, request, redirect, render_template
import requests
from datahandler import *

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    response = requests.get('https://swapi.co/api/planets').json()
    if request.method == 'POST':
        new_page = request.form.get('new-page')
        response = requests.get(new_page).json()
    next_page = response['next']
    previous_page = response['previous']
    planets = response['results']
    planets = format_result(planets)
    return render_template('index.html', next_page=next_page, previous_page=previous_page, planets=planets)


@app.route("/registration", methods=["GET", "POST"])
def registration():
    new_user = True
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        hashed_password = get_hashed_password(password)
        new_user = check_and_register_user(username, hashed_password)
        if new_user:
            session['username'] = username
            return redirect("/")
    return render_template('registration.html', new_user=new_user)


def format_result(planets):
    for planet in planets:
        planet["diameter"] += " km"
        if planet["surface_water"] != "unknown":
            planet["surface_water"] += "%"
        if planet["population"] != "unknown":
            planet["population"] += " people"
        if not planet["residents"]:
            planet["residents"] = "no known residents"
    return planets


def main():
    app.secret_key = "secret!planet"
    app.run(
        debug=True,
        port=9000
    )

if __name__ == '__main__':
    main()
