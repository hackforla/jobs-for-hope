import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import date, datetime
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
# import re
# import pandas as pd
# import os

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

def create_table_jobs():
    global c
    query = 'CREATE TABLE IF NOT EXISTS jobs (date DATE, org VARCHAR, job_title VARCHAR, job_location VARCHAR, job_post_date DATE, full_or_part VARCHAR, salary VARCHAR, info_link VARCHAR)'
    try:
        c.execute(query)
        db.commit()
    except sqlite3.IntegrityError:
       error_handler('SQL ERROR FOR QUERY: ' + query)

def drop_table_jobs():
    global c
    query = 'DROP TABLE IF EXISTS jobs '
    try:
        c.execute(query)
        db.commit()
    except sqlite3.IntegrityError:
       error_handler('SQL ERROR FOR QUERY: ' + query)

def insert_job(values):
    global c
    query = "INSERT INTO jobs (org, date, job_title, job_location, job_post_date, full_or_part, salary, info_link) VALUES (?,date('now'),?,?,?,?,?,?)"
    try:
        c.execute(query, values)
        db.commit()
    except sqlite3.IntegrityError:
        error_handler('SQL ERROR FOR QUERY: ' + query)

def get_soup(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "lxml")
    return soup

def month_string_to_num(string):
    m = {
    'jan': 1,
    'feb': 2,
    'mar': 3,
    'apr': 4,
    'may': 5,
    'jun': 6,
    'jul': 7,
    'aug': 8,
    'sep': 9,
    'oct': 10,
    'nov': 11,
    'dec': 12
    }
    s = string.strip()[:3].lower()
    try:
        out = m[s]
        return out
    except:
        raise ValueError('Not a month')

def update_db():
    global job_title
    global job_location
    global job_post_date
    global full_or_part
    global salary
    global info_link
    insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

# SQL CONNECTION

db = sqlite3.connect("jobs_for_hope.db")
c = db.cursor()

# Clear and recreate SQL schema
drop_table_jobs()
create_table_jobs()

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
# insert_job(organization, job_title, job_location, job_post_date, full_or_part, salary, info_link)
#

# 211 LA County

# organization = "211 LA County"

# soup = get_soup("https://www.211la.org/careers")

# for html_element in soup.find_all("div", {"class": "jobBtn"}):
#     for child in html_element.find_all("a"):
#         job_title = child.text
#         info_link = child.get('href')
#     insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

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
soup = get_soup("https://alliancehh.org/about/jobs/")

for html_element in soup.find_all('h4'):
    job_title = html_element.a.text
    info_link = html_element.a['href']
    listing_soup = get_soup(info_link)

    if listing_soup.body.find_all('p', string="Job Type: Full-time"):
        full_or_part = 'Full-time'
    elif listing_soup.body.find_all('p', string="Job Type: Part-time"):
        full_or_part = 'Part-time'

    date_text = listing_soup.body.find_all('span', {'class': 'subtitle'})[0].text.split()

    month_string = date_text[2]
    day = int(date_text[3][0:len(date_text[3])-1])
    year = int(date_text[4])
    month = month_string_to_num(month_string)

    job_post_date = datetime(year, month, day)

    insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

reset_vars()


# Antelope Valley Domestic Violence Council (Valley Oasis)

organization = "Antelope Valley Domestic Violence Council (Valley Oasis)"
soup = get_soup("http://www.valleyoasis.org/job-opportunities.html")

for html_element in soup.find("div",{"itemtype": "http://schema.org/WebPage"}).find_all('a'):
    temp_link = html_element['href']
    job_title = html_element.text

    if (html_element['href'][0:4] == 'http'):
        info_link = temp_link
    else:
        info_link = 'http://www.valleyoasis.org' + temp_link

    insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

reset_vars()


# Anti-Recidivism Coalition (ARC) Bromont
# PROBLEM: Job page for entry-level positions does not exist


# Ascencia

organization = "Ascencia"
soup = get_soup("https://www.ascenciaca.org/about/employment/")

for html_element in soup.find('div',{'class':"siteorigin-widget-tinymce textwidget"}).find_all('a'):
    job_title = html_element.text
    info_link = html_element['href']
    insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

reset_vars()


# BARTZ-Altadonna Clinic
# PROBLEM: Jobs listed are not entry-level; they are for MDs, clinical social workers, licensed psychologists, and nurses. Should probably not include this.

# Brilliant Corners

organization = "Brilliant Corners"
soup = get_soup("https://careers.jobscore.com/careers/brilliantcorners")

for job_container in soup.find_all("div",{"class":"js-job-container"}):
    job_title = job_container.find("span",{"class","js-job-title"}).a.text
    info_link = 'https://careers.jobscore.com' + job_container.find("span",{"class","js-job-title"}).a['href']
    job_location = job_container.find("span",{"class","js-job-location"}).text.strip()

    job_soup = get_soup(info_link)
    full_or_part = job_soup.find("h2", {"class":"js-subtitle"}).text.split(' | ')[2]
    insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

reset_vars()


# Catholic Charities Of Los Angeles, Inc.

organization = "Catholic Charities Of Los Angeles, Inc."
soup = get_soup("https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang")

## SCRAPING CODE

reset_vars()


# Center for the Pacific Asian Family, Inc.

organization = "Center for the Pacific Asian Family, Inc."
soup = get_soup("http://nurturingchange.org/get-involved/employment/")

for html_element in soup.find_all('div',{'class':'small-12 columns'})[4].find_all('a'):
    job_title = html_element.text
    link_info = html_element['href']
    insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

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
        insert_job((organization, job_title, job_location, job_post_date, full_or_part, salary, info_link))

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
soup = get_soup("https://www.healthright360.org/jobs")

while soup:
    for html_element in soup.find_all('div',{'class':'views-row'}):
        job_title = html_element.find('span',{'class':'field-content'}).a.text
        location_div = html_element.find('div',{'class':'views-field-field-job-city'})
        if location_div:
            job_location = location_div.find('span',{'class':'field-content'}).text
        info_div = html_element.find('div',{'class':'views-field-url'})
        info_link = info_div.find('span',{'class':'field-content'}).a['href']
        info_soup = get_soup(info_link)
        salary_div = info_soup.find('div',{'class':'views-field-field-compensation-range'})
        if salary_div:
            salary = salary_div.find('span',{'class':'field-content'}).text
            hours_div = info_soup.find('div',{'class':'views-field-field-hours-week'})
        if hours_div:
            hours = hours_div.find('span',{'class':'field-content'}).text
            full_or_part = hours + ' hours/week'
        # print_vars()
        update_db()
        reset_vars()
    # If there are more pages, update soup to next page and scrape
    if soup.find('a',{'title':'Go to next page'}):
        next_page_button = soup.find('a',{'title':'Go to next page'})
        next_page_url = "https://www.healthright360.org" + next_page_button['href']
        soup = get_soup(next_page_url)
    else:
        soup = False

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
