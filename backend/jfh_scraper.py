import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import date, datetime

# FUNCTIONS

def error_handler(error_msg):
    print error_msg
    exit()

def reset_vars():
    global job_title
    global job_location
    global job_post_date
    global full_or_part
    global salary
    global info_link
    
    job_title = ""
    job_location = ""
    job_post_date = ""
    full_or_part = ""
    salary = ""
    info_link = ""    

def print_vars():
    global job_title
    global job_location
    global job_post_date
    global full_or_part
    global salary
    global info_link
    
    print "Title: ", job_title
    print "Location: ", job_location
    print "Post Date: ", job_post_date
    print "Full or Part-Time: ", full_or_part
    print "Salary: ", salary
    print "Information: ", info_link

def insert_to_db(org, job_title, job_location, job_post_date, full_or_part, salary, info_link):
    global c
    global today
    query = "INSERT INTO jobs (org, date, job_title, job_location, job_post_date, full_or_part, salary, info_link) VALUES ('" + org + "','" + today  + "','" + job_title + "','" + job_location + "','" + job_post_date + "','" + full_or_part + "','" + salary + "','" + info_link + "')"
    print query
    try:
        c.execute(query)
        db.commit()
    except sqlite3.IntegrityError:
       error_handler('SQL ERROR FOR QUERY: ' + query)

def get_soup(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "lxml")
    return soup

# SQL CONNECTION

db = sqlite3.connect("jobs_for_hope.db")
c = db.cursor()

# Clear SQL Table

try:
    query = "DELETE FROM jobs"
    c.execute(query)
    db.commit()
except sqlite3.IntegrityError:
   error_handler('SQL ERROR FOR QUERY: ' + query)

today = date.today().strftime("%Y-%m-%d")

reset_vars()

#
# CODE FOR SCRAPING EACH JOBS WEBSITE
#
# URLs for each organization's job litsings is here: https://docs.google.com/spreadsheets/d/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/edit#gid=1092475733
#
# There are six possible fields to find on the pages: job_title, job_location, job_post_date, full_or_part, salary, info_link
#
# The only two required fields are job_title and info_link. Everything else is gravy.
#
# Use the examples from others below for traversing the HTML DOM tree for each page to pull out those fields
#
# When you're satisfied that your code is pulling the right fields, use this command to pop it into the database:
# insert_to_db(organization, job_title, job_location, job_post_date, full_or_part, salary, info_link)
#

# 211 LA County

organization = "211 LA County"

soup = get_soup("https://www.211la.org/careers")

for html_element in soup.find_all("div", {"class": "jobBtn"}):
    for child in html_element.find_all("a"):
        job_title = child.text
        info_link = child.get('href')
    insert_to_db(organization, job_title, job_location, job_post_date, full_or_part, salary, info_link)

reset_vars()

# A Community of Friends
# PROBLEM: Page fires JS to construct the HTML, so this must be scraped with a headless browser. But this is how it would work were it not for that:
#organization = "A Community of Friends"
#
#page = requests.get('https://recruiting.paylocity.com/recruiting/jobs/List/1438/A-COMMUNITY-OF-FRIENDS')
#page_text = page.text.encode('utf-8').decode('ascii', 'ignore')
#soup = BeautifulSoup(page.text, "lxml")
#
#for html_element in soup.find_all("div", {"class": "job-listing-job-item"}):
#    for child in html_element.find_all("div", {"class": "job-title-column"}):
#        for child2 in child.find_all("span", {"class": "job-item-title"}):
#            for child3 in child2.find_all("a"):
#                job_title = child3.text
#                info_link = child3.get('href')                
#        for child2 in child.find_all("span", {"class": ""}):
#            job_post_date = child2.text
#    for child in html_element.find_all("div", {"class": "location-column"}):
#        for child2 in child.find_all("span", {"class": "job-item-title"}):
#            job_location = child2.text
#    print_vars()
#
#reset_vars()

# Alliance for Housing and Healing (Formerly the Serra Project & Aid For Aids)

organization = "Alliance for Housing and Healing"

## SCRAPING CODE

reset_vars()


# Antelope Valley Domestic Violence Council (Valley Oasis)

organization = "Antelope Valley Domestic Violence Council (Valley Oasis)"

## SCRAPING CODE

reset_vars()


# Anti-Recidivism Coalition (ARC) Bromont
# PROBLEM: Job page for entry-level positions does not exist


# Ascencia

organization = "Ascencia"

## SCRAPING CODE

reset_vars()


# BARTZ-Altadonna Clinic
# PROBLEM: Jobs listed are not entry-level; they are for MDs, clinical social workers, licensed psychologists, and nurses. Should probably not include this.

# Brilliant Corners

organization = "Brilliant Corners"

## SCRAPING CODE

reset_vars()


# Catholic Charities Of Los Angeles, Inc.

organization = "Catholic Charities Of Los Angeles, Inc."

## SCRAPING CODE

reset_vars()


# Center for the Pacific Asian Family, Inc.

organization = "Center for the Pacific Asian Family, Inc."

## SCRAPING CODE

reset_vars()


# Chrysalis

organization = "Chrysalis"

## SCRAPING CODE

reset_vars()


# City of Pomona

organization = "City of Pomona"

## SCRAPING CODE

reset_vars()


# Coalition for Responsible Community Development

organization = "Coalition for Responsible Community Development"

## SCRAPING CODE

reset_vars()


# Corporation for Supportive Housing

organization = "Corporation for Supportive Housing"

## SCRAPING CODE

reset_vars()


# Covenant House

organization = "Covenant House"

page = requests.get('https://covca.hrmdirect.com/employment/job-openings.php?search=true&nohd=&dept=-1&city=-1&state=-1')
soup = BeautifulSoup(page.text, "lxml")

for html_element in soup.find_all("tr", {"class": "reqitem"}):
    for child in html_element.find_all("td", {"class": "posTitle"}):
        for child2 in child.find_all("a"):
            job_title = child.text
            info_link = "https://covca.hrmdirect.com/" + child2.get('href')
    for child in html_element.find_all("td", {"class": "cities"}):
        job_location = child.text
    if(job_location == "Los Angeles"):
        insert_to_db(organization, job_title, job_location, job_post_date, full_or_part, salary, info_link)
        
reset_vars()


# Divinity Prophet and Associates

organization = "Divinity Prophet and Associates"

## SCRAPING CODE

reset_vars()


# Downtown Women's Center

organization = "Downtown Women's Center"

## SCRAPING CODE

reset_vars()


# East San Gabriel Valley Coalition for the Homeless

organization = "East San Gabriel Valley Coalition for the Homeless"

## SCRAPING CODE

reset_vars()


# Exodus Recovery, Inc.

organization = "Exodus Recovery, Inc."

## SCRAPING CODE

reset_vars()


# Harbor Interfaith Services, Inc.

organization = "Harbor Interfaith Services, Inc."

## SCRAPING CODE

reset_vars()


# Hathaway-Sycamores Child and Family Services

organization = "Hathaway-Sycamores Child and Family Services"

## SCRAPING CODE

reset_vars()


# Homeless Health Care Los Angeles

organization = "Homeless Health Care Los Angeles"

## SCRAPING CODE

reset_vars()


# Housing Works

organization = "Housing Works"

## SCRAPING CODE

reset_vars()


# Illumination Foundation

organization = "Illumination Foundation"

## SCRAPING CODE

reset_vars()


# Inner City Law Center

organization = "Inner City Law Center"

## SCRAPING CODE

reset_vars()


# Jewish Family Service of Los Angeles

organization = "Jewish Family Service of Los Angeles"

## SCRAPING CODE

reset_vars()


# Jovenes, Inc.

organization = "Jovenes, Inc."

## SCRAPING CODE

reset_vars()


# JWCH Institute, Inc.

organization = "JWCH Institute"

## SCRAPING CODE

reset_vars()


# LA Family Housing Corporation

organization = "LA Family Housing Corporation"

## SCRAPING CODE

reset_vars()


# LifeSTEPS - Life Skills Training & Educational Programs

organization = "LifeSTEPS - Life Skills Training & Educational Programs"

## SCRAPING CODE

reset_vars()


# Los Angeles Centers For Alcohol and Drug Abuse

organization = "Los Angeles Centers For Alcohol and Drug Abuse"

## SCRAPING CODE

reset_vars()


# Los Angeles Gay & Lesbian Community Services Center

organization = "Los Angeles Gay & Lesbian Community Services Center"

## SCRAPING CODE

reset_vars()


# Los Angeles Homeless Services Authority

organization = "Los Angeles Homeless Services Authority"

## SCRAPING CODE

reset_vars()


# Lutheran Social Services

organization = "Lutheran Social Services"

## SCRAPING CODE

reset_vars()


# Mental Health America of Los Angeles

organization = "Mental Health America of Los Angeles"

## SCRAPING CODE

reset_vars()


# National Health Foundation

organization = "National Health Foundation"

## SCRAPING CODE

reset_vars()


# Neighborhood Legal Services of Los Angeles County

organization = "Neighborhood Legal Services of Los Angeles County"

## SCRAPING CODE

reset_vars()


# New Directions For Veterans, Inc.

organization = "New Directions For Veterans"

## SCRAPING CODE

reset_vars()


# Penny Lane Centers

organization = "Penny Lane Centers"

## SCRAPING CODE

reset_vars()


# People Assisting the Homeless (PATH)

organization = "People Assisting the Homeless"

## SCRAPING CODE

reset_vars()


# Prototypes, A Program of Healthright 360

organization = "Prototypes, A Program of Healthright 360"

## SCRAPING CODE

reset_vars()


# Safe Place for Youth

organization = "Safe Place for Youth"

## SCRAPING CODE

reset_vars()


# San Fernando Valley Community Mental Health Center, Inc.

organization = "San Fernando Valley Community Mental Health Center"

## SCRAPING CODE

reset_vars()


# SHARE! the Self Help And Recovery Exchange

organization = "SHARE! the Self Help And Recovery Exchange"

## SCRAPING CODE

reset_vars()


# Shields For Families, Inc.

organization = "Shields For Families"

## SCRAPING CODE

reset_vars()


# Skid Row Housing Trust

organization = "Skid Row Housing Trust"

## SCRAPING CODE

reset_vars()


# Special Service for Groups, Inc.

organization = "Special Service for Groups"

## SCRAPING CODE

reset_vars()


# St. Joseph Center

organization = "St. Joseph Center"

## SCRAPING CODE

reset_vars()


# Step Up on Second Street, Inc.

organization = "Step Up on Second Street"

## SCRAPING CODE

reset_vars()


# Tarzana Treatment Centers, Inc.

organization = "Tarzana Treatment Centers"

## SCRAPING CODE

reset_vars()


# The Center at Blessed Sacrament

organization = "The Center at Blessed Sacrament"

## SCRAPING CODE

reset_vars()


# The Clare Foundation, Inc.

organization = "The Clare Foundation"

## SCRAPING CODE

reset_vars()


# The People Concern (Formerly OPCC & LAMP)

organization = "The People Concern"

## SCRAPING CODE

reset_vars()


# The Salvation Army

organization = "The Salvation Army"

## SCRAPING CODE

reset_vars()


# The Village Family Services

organization = "The Village Family Services"

## SCRAPING CODE

reset_vars()


# The Whole Child

organization = "The Whole Child"

## SCRAPING CODE

reset_vars()


# Union Station Homeless Services

organization = "Union Station Homeless Services"

## SCRAPING CODE

reset_vars()


# United Friends of the Children

organization = "United Friends of the Children"

## SCRAPING CODE

reset_vars()


# United Way of Greater Los Angeles

organization = "United Way of Greater Los Angeles"

## SCRAPING CODE

reset_vars()


# Upward Bound House

organization = "Upward Bound House"

## SCRAPING CODE

reset_vars()


# Volunteers of America

organization = "Volunteers of America"

## SCRAPING CODE

reset_vars()


# Weingart Center Association

organization = "eingart Center Association"

## SCRAPING CODE

reset_vars()


db.close()
