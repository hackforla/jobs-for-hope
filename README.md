# Jobs for Hope
Aggregate job opportunities with homeless service providers so that people can search for a job that fits their skillset.

## Frontend Developer Setup(in use now)
1. Fork repo to your github account
2. Clone the forked repo to your local working directory.
3. Run `npm install` to install all frontend build tools and production dependencies
4. Run `npm start` to run a live version of the project

## Project Structure
1. app.py: This is the main entrypoint into the application that contains the routes and associated business logic. This file also contains the main instantiation of the app object
2. api.py: This is the main class for the REST API that allows interaction with the database
3. requirements.txt: This is the file that contains all of the projects backend dependencies. Pip looks inside here when it installs all dependencies
4. readme.md: This is the file that contains all instructions and descriptions about jobs-for-hope
5. static folder: This folder contains all of the Javascript and CSS content. Place all JS and CSS into their respective folders.
6. templates folder: This folder contains all of the html templates that are rendered by the application. All Jinjas2 and HTML templates go here.
7. utilities folder: This folder contains all of the helper tools used to write and read data to and from the database. It also contains utility scripts used for the application

## Dependencies
-[React](https://reactjs.org/)
-[SASS](https://sass-lang.com/)

## Contributing
1. CSS: This project uses SASS so please make any styling changes to the /templates/static/scss/style.scss file.

## Eventual-Backend Developer Setup(currently not in use)

~~1. Download the required software for the project:
- Python 3.6 (https://www.python.org/downloads/release/python-360/)
  - Run this script using Python IF PIP DOES NOT COME INSTALLED (https://bootstrap.pypa.io/get-pip.py)
- Git (https://git-scm.com/downloads) GUI Add-Ons(https://git-scm.com/download/gui/windows)

2. Install virtualenv using pip
- First, navigate to the folder which contains Python
- Next, navigate to the "Scripts" folder. You should see a file called "pip.py"
- Copy the path to the Scripts folder and then go to the command line or terminal
- Inside of terminal, type: "cd <PATH TO YOUR SCRIPTS FOLDER>". For example, for me: cd "C:\Users\Ryanluu2017\AppData\Local\Programs\Python\Python36\Scripts"
- Afterwards, type "pip install virtualenv". This should create a file named "virtualenv.exe"
- Type "ls" or "dir" in your Scripts directory and ensure that you can see "virtualenv.exe"

3. Activate the virtualenv
- Once you can locate the aforementioned file, type in "virtualenv.exe <PATH TO YOUR PROJECT FOLDER>". For example, for me: virtualenv.exe "C:\Users\Ryanluu2017\Documents\Programming\jobs-for-hope\"
- If all goes well, a virtual environment will be started in your project folder. You can verify this by going into the folder you entered above and looking at the project structure. You should see a new "Scripts" folder.
- Navigate inside of the "Scripts" folder and then type in "activate". For example, for me: C:\Users\Ryanluu2017\Documents\Programming\jobs-for-hope\Scripts\activate
- You should see that "(jobs-for-hope)" should be displayed to the left of your path. This notifies you that you are in the virtual environment.

4. Install all required libraries
- Now that you are in the virtual environment and while you are still inside the "Scripts" folder, run "pip install -r requirements.txt". This will install all of the requirements for the projects into your virtual environment.
- You should notice that Python will install all required packages, which include Flask, Flask-Restful, and gunicorn

5. Deactivate the virtualenv
- When you are done working on the project, you can deactivate the environment by navigating to the "Scripts" folder inside your project directory and typing in "deactivate". You should see that the project name will be removed from the left of your path. For example, for me:
C:\Users\Ryanluu2017\Documents\Programming\jobs-for-hope\Scripts\deactivate

6. Running the application
- Navigate back to the root folder for the jobs-for-hope project. For example, for me: cd "C:\Users\Ryanluu2017\Documents\Programming\jobs-for-hope\"
- Then type in "python app.py". This should then run the application and print out a url to the screen
- You should see the webpage popup at localhost:5000.
- Congratulations, you have successfully set up your development environment.~~

