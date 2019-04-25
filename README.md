# Jobs for Hope
Aggregate job opportunities with homeless service providers so that people can search for a job that fits their skillset.

## Prerequisites
1. Git for working with Github source code
2. Node and npm for running the web app
3. Python 2 and pip for running the web scraper

### Complete beginner instructions
<details><summary>click here to show</summary><p>

#### Windows 10
<details><summary>show</summary><p>

1. Enable Windows Subsystem for Linux (reference: https://docs.microsoft.com/en-us/windows/wsl/install-win10 https://lifehacker.com/how-to-get-started-with-the-windows-sybsystem-for-linux-1828952698)
    1. In the search bar, type "turn windows features on or off" and choose the correct item
    1. Scroll down and check the box for Windows Subsystem for Linux
    1. Windows will restart to complete the installation
1. Install Ubuntu Linux
    1. Open the Microsoft Store and search for "Run Linux on Windows"
    1. Install and launch Ubuntu
    1. Set up a new linux user account when running for the first time
    1. Update and upgrade all packages
        1. In a terminal, run (you will need to type in your user password when running sudo)
        ```
        sudo apt update && sudo apt upgrade
        ```
        1. Press enter to upgrade everything
1. Continue to Linux instructions
</p></details>

#### Linux
<details><summary>show</summary><p>
    
1. Install Homebrew on Linux (reference: https://docs.brew.sh/Homebrew-on-Linux)
    1. Open a Linux terminal
    1. Install dependencies
        * Debian-based (Ubuntu)
        ```
        sudo apt install build-essential curl file git
        ```
        * Fedora-based
        ```
        sudo yum groupinstall 'Development Tools' && sudo yum install curl file git
        ```
    1. Install homebrew
    ```
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
    ```
1. Install packages
```
brew install python@2 postgresql
```
</p></details>

#### OSX
<details><summary>show</summary><p>

1. Install homebrew (https://brew.sh/)
1. Install packages
```
brew install git python@2 postgresql
```
</p></details>

#### Common Tools for all OSes
<details><summary>show</summary><p>
    
1. Install Visual Studios Code (https://code.visualstudio.com/)
    1. Install Prettier - Code formatter extension
1. Install DBeaver (https://dbeaver.io/), Community Edition
1. Install nvm, node, and npm (reference: https://gist.github.com/d2s/372b5943bce17b964a79)
    1. Install nvm
    ```
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
    ```
    1. Install the latest LTS Node.js (https://nodejs.org/en/)
    ```
    nvm install v10.15.3
    ```
</p></details>
</p></details>

## Full-Stack React/Node Application Installation
1. Clone this repo to your local drive.
    <details><summary>details</summary><p>

    1. Start a terminal app, such as Ubuntu for Windows Subsystem for Linux
    1. Create a src directory in the user's home directory and go in it
    
    ```
    cd && mkdir src && cd src
    ```
    3. Clone the repository
    ```
    git clone https://github.com/hackforla/jobs-for-hope
    ```
    </p></details>

2. Change to the jobs-for-hope directory:
```
cd jobs-for-hope
```
3. Install the node server npm depedencies:
```
npm install
```
4. Obtain the ```.env``` file from the slack channel and place it in this directory. It contains private info (i.e., the production database connection string) that we cannot put in this public GitHub repo.
4. Change to the client directory:
```
cd client
```
5. Install the client (React) dependencies:
```
npm install
```
## To Run the React/Node Application
1. Run ```npm start``` from the jobs-for-hope directory to start the node server.
2. Run ```npm start``` from the jobs-for-hope/client directory to start the react app and open the browser.


## Backend Python Scraper Setup
2. Install virtualenv using pip

        pip install virtualenv virtualenvwrapper

3. Find virtualenvwrapper.sh location 

        which virtualenvwrapper.sh

4. Create directory to hold virtual environments

        mkdir $HOME/.virtualenvs

5. Add to .bash_profile

        export WORKON_HOME=$HOME/.virtualenvs
        source /path/to/virtualenwrapper.sh

6. Create the virtualenv

        source ~/.bash_profile  // activate virtualenvwrapper.sh, just for the first time
        mkvirtualenv jobs-for-hope
        mkvirtualenv -p /usr/local/bin/path/to/python2.7 jobs-for-hope  // use this if the system default is python3

7. Activate the virtualenv

        workon  // list the existing virtual environments, blank if none is created
        workon jobs-for-hope  // activate virtual environment, not needed when first creating the virtualenv

8. Install project dependencies

        pip install -r ./requirements.txt

9. Work on the scraper and run

    a. for sqlite

        python jfh_scraper.py
        
    b. for postgres

        python scraper_runner.py

9. Deactivate the virtualenv

        deactivate  // switch back to system python

## Checking the database for scraped data

We're moving towards using postgres and using the instance hosted on aws. The sqlite will go away soon.

### Postgres

1. Install DBeaver for your system.

2. Add a database connection with the .env file credentials from the slack channel.

3. The jobs are in the jobs table.

### Sqlite

1. Install sqlite

        brew install sqlite

2. Make sure the db file is there

        ls -l jobs_for_hope.db

3. Open the database environment (Ctrl-D to exit)

        sqlite3 jobs_for_hope.db

4. Print the db schema

        .schema

5. Print the jobs table row count

        select count(*) from jobs;

6. Print all the jobs

        select * from jobs;

7. Exit db. Press Ctrl-D

## Project Structure
1. app.py: This is the main entrypoint into the application that contains the routes and associated business logic. This file also contains the main instantiation of the app object
2. api.py: This is the main class for the REST API that allows interaction with the database
3. backend/requirements.txt: This is the file that contains all of the projects backend dependencies. Pip looks inside here when it installs all dependencies
3. backend/jfh_scraper.py: This is the scraper which parses websites for jobs data and stores them in an sqlite database
4. readme.md: This is the file that contains all instructions and descriptions about jobs-for-hope
5. static folder: This folder contains all of the Javascript and CSS content. Place all JS and CSS into their respective folders.
6. templates folder: This folder contains all of the html templates that are rendered by the application. All Jinjas2 and HTML templates go here.
7. utilities folder: This folder contains all of the helper tools used to write and read data to and from the database. It also contains utility scripts used for the application

## Branches
1. master: main stable branch with frontend and backend getting data from a temporary spreadsheet
2. seleniumscrapers: development branch for the python scraper
3. db_backend: development branch which integrates the frontend with the backend api using real data from the sqlite database


## Contributing
