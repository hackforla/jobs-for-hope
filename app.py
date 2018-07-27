from flask import Flask, request, render_template
from flask_restful import reqparse, Api, Resource

from utilities.database_utilities import DatabaseUtilities

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("index.html")

if __name__ =="__main__":
    app.run(debug=True)