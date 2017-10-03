from flask import Flask, session, url_for, request, redirect, render_template
import requests

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
    for planet in planets:
        planet["diameter"] += " km"
        if planet["surface_water"] != "unknown":
            planet["surface_water"] += "%"
        if planet["population"] != "unknown":
            planet["population"] += " people"
        if planet["residents"]:
            planet["residents"] = "{} resident(s)".format(len(planet["residents"]))
        elif not planet["residents"]:
            planet["residents"] = "no known residents"
    return render_template('index.html', next_page=next_page, previous_page=previous_page, planets=planets)


def main():
    app.secret_key = "secret!planet"
    app.run(
        debug=True,
        port=9000
    )

if __name__ == '__main__':
    main()
