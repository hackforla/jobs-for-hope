# Jobs for Hope

Aggregate job opportunities with homeless service providers so that people can search for a job that fits their skillset.

## Prerequisites

1.  Git for working with Github source code
2.  Node and npm for running the web app
3.  Python 2 and pip for running the web scraper

### Complete beginner instructions

<details><summary>click here to show</summary><p>

#### Windows

<details><summary>show</summary><p>

1.  Install chocolatey (https://chocolatey.org/install)
    1.  Install chocolatey gui (optional)
        ```
        choco install chocolateygui -y
        ```
1.  Install git, chromium, chromedriver, vscode, python2, dbeaver, nodejs
    ```
    choco install git chromium chromedriver vscode python2 dbeaver nodejs -y
    ```
1.  Install postgresql and set postgres user password
    ```
    choco install postgresql --params '/Password:password' --params-global -y
    ```

</p></details>

#### Windows 10

<details><summary>show</summary><p>

1.  Enable Windows Subsystem for Linux (reference: https://docs.microsoft.com/en-us/windows/wsl/install-win10 https://lifehacker.com/how-to-get-started-with-the-windows-sybsystem-for-linux-1828952698)
    1.  In the search bar, type "turn windows features on or off" and choose the correct item
    1.  Scroll down and check the box for Windows Subsystem for Linux
    1.  Windows will restart to complete the installation
1.  Install Ubuntu Linux
    1.  Open the Microsoft Store and search for "Run Linux on Windows"
    1.  Install and launch Ubuntu
    1.  Set up a new linux user account when running for the first time
    1.  Update and upgrade all packages
        1.  In a terminal, run (you will need to type in your user password when running sudo)
            ```
            sudo apt update && sudo apt upgrade -y
            ```
1.  Install ChomeDriver
    1.  Install chocolatey (https://chocolatey.org/install)
    1.  Install ChomeDriver
        ```
        choco install chromedriver -y
        ```
    1.  Add a file `chromedriver` to the project directory with this content
        ```
        #!/bin/sh
        chromedriver.exe "$@"
        ```
1.  Continue to Linux instructions
    </p></details>

#### Linux

<details><summary>show</summary><p>

1.  Install Homebrew on Linux (reference: https://docs.brew.sh/Homebrew-on-Linux)
    1.  Open a Linux terminal
    1.  Install dependencies
        - Debian-based (Ubuntu)
          ```
          sudo apt install build-essential curl file git
          ```
        - Fedora-based
          ```
          sudo yum groupinstall 'Development Tools' && sudo yum install curl file git
          ```
    1.  Install homebrew
        ```
        sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
        ```
1.  Install packages
    `brew install python@2 postgresql sudo apt install chromium-chromedriver -y`
    </p></details>

#### macOS

<details><summary>show</summary><p>

1.  Install homebrew (https://brew.sh/)
1.  Install packages
    `brew install git python@2 postgresql brew cask install chromedriver`
    </p></details>

#### Common Tools for all OSes

<details><summary>show</summary><p>

1.  Install Visual Studios Code (https://code.visualstudio.com/)
    1.  Install Prettier - Code formatter extension
1.  Install DBeaver (https://dbeaver.io/), Community Edition
1.  Install nvm, node, and npm (reference: https://gist.github.com/d2s/372b5943bce17b964a79)
    1.  Install nvm
        ```
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
        ```
    1.  Install the latest LTS Node.js (https://nodejs.org/en/)
        ```
        nvm install v10.15.3
        ```
1.  Download and install Chrome (https://www.google.com/chrome/)
1.  Setup Postgresql (reference: https://github.com/michaeltreat/Windows-Subsystem-For-Linux-Setup-Guide/blob/master/readmes/installs/PostgreSQL.md)

    1.  Start the postgres service
        1.  Start a terminal app
            1.  linux (and WSL)
                1.  Start the service
                    ```
                    sudo service postgresql start
                    ```
                1.  Setup the postgres user (linux)
                    1.  Start a terminal app
                    1.  Set the password
                        ```
                        sudo passwd postgres
                        ```
                    1.  Type in the password and confirmation
                    1.  Close the terminal
                1.  Connect to postgres
                    1.  Start a terminal app
                    1.  Switch to the postgres user and start the psql prompt
                        ```
                        sudo -u postgres psql
                        ```
                    1.  If the above doesn't work, do this instead
                        ```
                        su - postgres
                        psql
                        ```
                1.  Troubleshooting postgres on WSL (reference: https://github.com/Microsoft/WSL/issues/3863)
                    1.  Append this at the end of `/etc/postgresql/10/main/postgresql.conf`
                        ```
                        data_sync_retry = true
                        ```
            1.  macOS
                1.  Start the service
                    ```
                    brew services start postgresql
                    ```
                1.  Connect to postgres
                    1.  Start a terminal app
                    1.  enter the psql prompt
                        ```
                        psql postgres
                        ```
    1.  Create the database (reference: https://www.techrepublic.com/blog/diy-it-guy/diy-a-postgresql-database-server-setup-anyone-can-handle/)

        1.  Start the psql prompt
        1.  Issue the command
            ```
            create database jobsforhope;
            ```
        1.  Create the user
            1. Start the psql prompt
            1. Issue the command
               ```
               create user jobsforhope;
               ```
            1. Check that the user was created
               ```
               \du
               ```
        1.  Grant user privilege 1. Start the psql prompt 1. Issue the command
            `grant all privileges on database jobsforhope to jobsforhope;`

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
   1. Clone the repository
      ```
      git clone https://github.com/hackforla/jobs-for-hope
      ```

    </p></details>

1. Change to the jobs-for-hope directory:
   ```
   cd jobs-for-hope
   ```
1. Install the node server npm depedencies:
   ```
   npm install
   ```
1. Obtain the `.env` file from the slack channel and place it in this directory. It contains private info (i.e., the production database connection string) that we cannot put in this public GitHub repo.
1. Change to the client directory:
   ```
   cd client
   ```
1. Install the client (React) dependencies:
   ```
   npm install
   ```

## To Run the React/Node Application

1.  Run `npm start` from the jobs-for-hope directory to start the node server.
1.  Run `npm start` from the jobs-for-hope/client directory to start the react app and open the browser.

## Backend Python Scraper Setup

1.  Virtualenv (optional, but will be useful if you eventually want to have multiple python projects)

    <details><summary>show</summary><p>

    1.  Set up virtualenv

        1.  Install virtualenv using pip
            ```
            pip install virtualenv virtualenvwrapper
            ```
        1.  cd into project directory
            ```
            cd jobs-for-hope/backend
            ```
        1.  create the virtualenv

            ```
            virtualenv venv
            ```

            <details><summary>Alternative for systems where python 2.7 is not the default</summary><p>

            1.  Specify the python location when creating the virtualenv

                ```
                virtualenv -p /usr/local/bin/path/to/python2.7 venv # use this if the system default is python3
                ```

            </p></details>

        <details><summary>alternative setup using virtualenvwrapper</summary><p>

        1.  Install virtualenv using pip
            ```
            pip install virtualenv virtualenvwrapper
            ```
        1.  Create directory to hold virtual environments
            ```
            mkdir $HOME/.virtualenvs
            ```
        1.  Find out where virtualenvwrapper.sh is located for next step
            ```
            which virtualenvwrapper.sh
            ```
        1.  Make `.bash_profile` call `.bashrc` (reference:http://www.joshstaiger.org/archives/2005/07/bash_profile_vs.html)
            1.  Add this to `.bash_profile`
                ```
                if [ -f ~/.bashrc ]; then
                  source ~/.bashrc
                fi
                ```
        1.  Add to `.bashrc`
            ```
            export WORKON_HOME=$HOME/.virtualenvs
            export PATH="/path/to/virtualenvwrapper:$PATH"
            source virtualenvwrapper.sh
            ```
        1.  Start a new terminal session or call `.bashrc`
            ```
            source ~/.bashrc        # activate virtualenvwrapper.sh, just for the first time
            ```
        1.  Create the virtualenv

            ```
            mkvirtualenv jobs-for-hope
            ```

            <details><summary>Alternative for systems where python 2.7 is not the default</summary><p>

            1.  Specify the python location when creating the virtualenv
                `mkvirtualenv -p /usr/local/bin/path/to/python2.7 jobs-for-hope # use this if the system default is python3`
            </p></details>

        </p></details>

    1.  Activate the virtualenv

        ```
        source venv/bin/activate
        ```

        <details><summary>for virtualenvwrapper</summary><p>

        ```
        workon  // list the existing virtual environments, blank if none is created
        workon jobs-for-hope  // activate virtual environment, not needed when first creating the virtualenv
        ```

        </p></details>

    1.  Do work and run python within the virtualenv
    1.  Deactivate the virtualenv

        ```
        deactivate // switch back to system python
        ```

    </p></details>

    1.  All python commands should be run inside the jobs-for-hope virtualenv if you choose to set it up. You will have to make sure the virtualenv is activated before following the steps.

1.  Install project dependencies
    ```
    cd backend
    pip install -r ./requirements.txt
    ```
1.  Setup for the scrapers
    1.  Download the `database.ini` file from the slack channel into the `backend` directory
    1.  Dump the aws database to a file (reference `database.ini` for values)
        ```
        pg_dump -d <database> -h <host> -U <user> -C -f jobsforhope.sql
        ```
    1.  restore to the local database
        ```
        psql -h localhost -U postgres -d jobsforhope -f jobsforhope.sql
        ```

## To run the scraper

1.  Switch to the backend directory
    ```
    cd backend
    ```
1.  To run all the scrapers
    ```
    python scraper_runner.py
    ```
1.  To run a single scraper
    ```
    python scraper_runner.py scrapers/prototypes.py
    ```

## Checking the database for scraped data

1.  Use DBeaver
1.  Add a postgres database connection with the .env file credentials from the slack channel.
1.  The jobs are in the jobs table.
