from flask import Flask, request, render_template
from flask_restful import reqparse, Api, Resource

from utilities.database_utilities import DatabaseUtilities

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("index.html")

@app.route("/detailed-jobs")
def detailed_jobs():
    return render_template("detailed-jobs.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

<<<<<<< HEAD
@app.route("/organizations")
def organizations():
    return render_template("organizations.html")

=======
>>>>>>> b44dc248c30239ca6cf06dce227a0502effbfa39
if __name__ =="__main__":
    app.run(debug=True)
