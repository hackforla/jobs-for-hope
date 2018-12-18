import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import date, datetime, timedelta
from datecleaner import month_to_num, string_to_date
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# FUNCTIONS

def error_handler(error_msg):
    print error_msg
    exit()

def reset_vars():
    global job_title
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link
    
    job_title = ""
    job_location = ""
    job_zip_code = ""
    job_post_date = ""
    full_or_part = ""
    salary = ""
    info_link = ""

def print_vars():
    global job_title
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link
    
    print "Title: ", job_title
    print "Location: ", job_location
    print "Zip Code: ", job_zip_code
    print "Post Date: ", job_post_date
    print "Full or Part-Time: ", full_or_part
    print "Salary: ", salary
    print "Information: ", info_link

def create_table_jobs():
    global c
    query = 'CREATE TABLE IF NOT EXISTS jobs (date DATE, org VARCHAR, job_title VARCHAR, job_location VARCHAR, job_zip_code VARCHAR, job_post_date DATE, full_or_part VARCHAR, salary VARCHAR, info_link VARCHAR)'
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
    query = "INSERT INTO jobs (org, date, job_title, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link) VALUES (?,date('now'),?,?,?,?,?,?,?)"
    try:
        c.execute(query, values)
        db.commit()
    except sqlite3.IntegrityError:
        error_handler('SQL ERROR FOR QUERY: ' + query)

def get_soup(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "lxml")
    return soup

def get_javascript_soup(url):
    browser = webdriver.Chrome('./chromedriver')
    browser.get(url)
    innerHTML = browser.execute_script("return document.body.innerHTML")
    browser.quit()
    return BeautifulSoup(innerHTML, "lxml")

def get_javascript_soup_delayed(url, dynamicElement):
    driver = webdriver.Chrome('./chromedriver')
    driver.get(url)
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, dynamicElement))
        )
    finally:
        innerHTML = driver.execute_script("return document.body.innerHTML")
        driver.quit()
        return BeautifulSoup(innerHTML, "lxml")

def update_db(organization_name):
    global job_title
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link
    insert_job((organization_name, job_title, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link))

def date_ago(timeLength, timeUnit):
    timeUnit = timeUnit.strip().lower()
    today = datetime.today()
    if timeUnit[:3] == 'day':
        return today - timedelta(days=timeLength)
    elif timeUnit[:5] == 'month':
        return today - timedelta(days=30*timeLength)
    elif timeUnit[:4] == 'year':
        return today - timedelta(days=365*timeLength)

def clean_location(string):
    return string.split(',')[0].strip()

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
# There are seven possible fields to find on the pages: job_title, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link
#
# The only two required fields are job_title and info_link. Everything else is gravy.
#
# Use the examples from others below for traversing the HTML DOM tree for each page to pull out those fields
#
# When you're satisfied that your code is pulling the right fields, use this command to pop it into the database:
# insert_job(organization, job_title, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link)
#

# 211 LA County

organization = "211 LA County"

soup = get_soup("https://www.211la.org/careers")

for html_element in soup.find_all("div", {"class": "jobBtn"}):
    for child in html_element.find_all("a"):
        job_title = child.text
        info_link = child.get('href')
    update_db(organization)

reset_vars()

# A Community of Friends
# JS-Rendered Page; Scraped with Selenium
organization = "A Community of Friends"
url = "https://recruiting.paylocity.com/recruiting/jobs/List/1438/A-COMMUNITY-OF-FRIENDS"
soup = get_javascript_soup(url)

job_listings = soup.find_all('div',{'class':'job-listing-job-item'})

for job_listing in job_listings:
    job_description = job_listing.find_all('span')
    # Get job title and link
    job_title = job_description[0].a.text
    info_link = 'https://recruiting.paylocity.com' + job_description[0].a['href']
    # Get date as string
    date = job_description[1].text
    # Clean up date string by removing trailing -'s, then split and convert to datetime object
    if date[len(date)-2] == '-':
        date = date[0:len(date)-3]
    date = date.strip().split('/')
    month = int(date[0])
    day = int(date[1])
    year = int(date[2])
    job_post_date = datetime(year, month, day)
    # Get Location
    job_location = job_listing.find('div',{'class':'location-column'}).span.text
    # Get soup of job listing to scrape more info
    listing_soup = get_soup(info_link)
    listing_body = listing_soup.find('body').find_all('p')
    # Retrieve Full/Part-time and Salary info if available
    if 'Status' in listing_body[1].text:
        full_or_part = listing_body[1].text[8:]
    if 'Salary' in listing_body[2].text:
        salary = listing_body[2].text[14:]
    print_vars()
    update_db(organization)
    reset_vars()

reset_vars()

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
    month = month_to_num(month_string)

    job_post_date = datetime(year, month, day)

    update_db(organization)
    reset_vars()

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

    update_db(organization)

reset_vars()


# Anti-Recidivism Coalition (ARC) Bromont
# PROBLEM: Job page for entry-level positions does not exist


# Ascencia

organization = "Ascencia"
soup = get_soup("https://www.ascenciaca.org/about/employment/")

for html_element in soup.find('div',{'class':"siteorigin-widget-tinymce textwidget"}).find_all('a'):
    job_title = html_element.text
    info_link = html_element['href']
    update_db(organization)

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
    update_db(organization)

reset_vars()


# Catholic Charities Of Los Angeles, Inc.

organization = "Catholic Charities Of Los Angeles, Inc."
url = "https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang"
catholicDriver = webdriver.Chrome('./chromedriver')
catholicDriver.get(url)

try:
    element = WebDriverWait(catholicDriver, 10).until(
        EC.presence_of_element_located((By.ID, "btnShowAllJobs"))
    )
finally:
    python_button = catholicDriver.find_element_by_id('btnShowAllJobs')
    python_button.click()

try:
    element2 = WebDriverWait(catholicDriver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "current-openings-item"))
    )
finally:
    innerHTML = catholicDriver.execute_script("return document.body.innerHTML")
    catholicDriver.quit()

soup = BeautifulSoup(innerHTML, "lxml")

current_openings = soup.find_all('div',{'class':'current-openings-details'})

for opening_detail in current_openings:
    job_title = opening_detail.find('span',{'class':'current-opening-title'}).text.strip()
    if (opening_detail.find('span', {'class':'current-opening-location-item'})):
        job_location = opening_detail.find('span', {'class':'current-opening-location-item'}).text.strip()
    # Calculate post date relative to current date and store it
    posted_ago = opening_detail.find('span',{'class':'current-opening-post-date'}).text.split(' ')
    if (posted_ago[0] == 'a'):
        job_post_date = date_ago(1, posted_ago[1])
    else:
        job_post_date = date_ago(int(posted_ago[0]), posted_ago[1])
    if (opening_detail.find('span', {'class':'current-opening-worker-catergory'})):
        full_or_part = opening_detail.find('span', {'class':'current-opening-worker-catergory'}).text.strip()
    info_link = 'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang'
    update_db(organization)
    reset_vars()

reset_vars()


# Center for the Pacific Asian Family, Inc.

organization = "Center for the Pacific Asian Family, Inc."
soup = get_soup("http://nurturingchange.org/get-involved/employment/")

for html_element in soup.find_all('div',{'class':'small-12 columns'})[4].find_all('a'):
    job_title = html_element.text
    info_link = html_element['href']
    update_db(organization)

reset_vars()


# Chrysalis

organization = "Chrysalis"
soup = get_soup("http://changelives.applicantstack.com/x/openings")

jobs_table = soup.find('tbody')

for job_entry in jobs_table.find_all('tr'):
    job_details = job_entry.find_all('td')
    job_title = job_details[0].find('a').text
    info_link = job_details[0].find('a')['href']
    job_location = job_details[2].text
    print_vars()
    update_db(organization)
    reset_vars()

reset_vars()


# City of Pomona

organization = "City of Pomona"
soup = get_javascript_soup_delayed('http://agency.governmentjobs.com/pomona/default.cfm','jobtitle')

jobs_table = soup.find('table',{'class':'NEOGOV_joblist'})

for job_entry in jobs_table.find('tbody').find_all('tr'):
    job_details = job_entry.find_all('td')
    job_title = job_details[0].find('a').text.strip()
    info_link = 'http://agency.governmentjobs.com/pomona/' + job_details[0].find('a')['href']
    full_or_part = job_details[1].text.strip()
    salary = job_details[2].text.strip()
    job_location = 'Pomona'
    update_db(organization)
    reset_vars()

reset_vars()


# Coalition for Responsible Community Development

organization = "Coalition for Responsible Community Development"
soup = get_soup('http://www.coalitionrcd.org/get-involved/work-at-crcd/')

for job_module in soup.find_all('div',{'class':'et_pb_toggle'}):
    job_title = job_module.find('h5').text.strip()
    job_link = 'http://www.coalitionrcd.org/get-involved/work-at-crcd/'
    update_db(organization)

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
        update_db(organization)

reset_vars()


# Divinity Prophet and Associates

organization = "Divinity Prophet and Associates"

## SCRAPING CODE

reset_vars()


# Downtown Women's Center

organization = "Downtown Women's Center"
soup = get_soup('https://www.downtownwomenscenter.org/career-opportunities/')

job_lists = soup.find('div',{'class':'post'}).find_all('ul')

for i in range(len(job_lists)):
    job_list = job_lists[i]
    for job_entry in job_list.find_all('li'):
        if i==0:
            full_or_part = 'Full-Time'
        elif i==1:
            full_or_part = 'Part-Time'
        else:
            full_or_part = 'On-Call'
        job_title = job_entry.a.text
        info_link = job_entry.a['href']
        job_soup = get_soup(info_link)
        job_details = job_soup.find('div',{'aria-label':'Job Details'})
        if job_details:
            job_location = job_details.find('span',{'aria-label':'Job Location'}).text
            salary = job_details.find('span',{'aria-label':'Salary Range'}).text
        print_vars()
        reset_vars()
        update_db(organization)
        reset_vars()

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
        update_db(organization)
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
soup = get_soup("http://www.safeplaceforyouth.org/employment_opportunities")

jobs_div = soup.find('div', {'id':'yui_3_16_0_ym19_1_1492463820306_5454'})

for job_listing in jobs_div.find_all('p'):
    listing_element = job_listing.find('a')
    job_title = listing_element.text
    info_link = listing_element['href']
    update_db(organization)

reset_vars()


# San Fernando Valley Community Mental Health Center, Inc.

organization = "San Fernando Valley Community Mental Health Center"

## SCRAPING CODE

reset_vars()


# SHARE! the Self Help And Recovery Exchange

organization = "SHARE! the Self Help And Recovery Exchange"
soup = get_soup("https://shareselfhelp.org/programs-share-the-self-help-and-recovery-exchange/share-jobs-share-self-help-recovery-exchange/")

for html_element in soup.find_all('h4'):
    job_title = html_element.a.text
    info_link = html_element.a['href']
    job_location = html_element.span.text.split(']')[1]
    update_db(organization)

reset_vars()


# Shields For Families, Inc.

organization = "Shields For Families"
# soup = get_soup('https://recruiting.paylocity.com/recruiting/jobs/List/1853/Shields-For-Families')

# job_listing_pattern = re.compile('\{"JobId".*\}')
# soup.find("script", text=job_listing_pattern)

## SCRAPING CODE

reset_vars()


# Skid Row Housing Trust

organization = "Skid Row Housing Trust"
# soup = get_soup('https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=37F34A94DC3DBD8AA2C5ACCA82E66F1E&jpt=#')

## SCRAPING CODE

reset_vars()


# Special Service for Groups, Inc.

organization = "Special Service for Groups"
soup = get_soup('http://www.ssg.org/about-us/careers/')
article = soup.find('article')

for html_element in article.find_all('p'):
    if 'Posted ' in html_element.text:
        job_element = html_element.find('a')
        job_title = job_element.text
        info_link = job_element['href']
        date = html_element.text.split('Posted ')[1].split('/')
        month = int(date[0])
        day = int(date[1])
        year = int(date[2])
        job_post_date = datetime(year, month, day)
        update_db(organization)
        reset_vars()

reset_vars()


# St. Joseph Center

organization = "St. Joseph Center"
# soup = get_soup('https://stjosephctr.org/careers/')

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
soup = get_soup('http://clarefoundation.org/careers/')

listings_container = soup.find('ul',{'class':'display-posts-listing'})

for listing in listings_container.find_all('li'):
    job_title = listing.text
    info_link = listing.a['href']
    update_db(organization)

reset_vars()


# The People Concern (Formerly OPCC & LAMP)

organization = "The People Concern"
# soup = get_soup('https://www.thepeopleconcern.org/careers.php')



## SCRAPING CODE

reset_vars()


# The Salvation Army

organization = "The Salvation Army"

## SCRAPING CODE

reset_vars()


# The Village Family Services

organization = "The Village Family Services"
soup = get_soup('http://new.thevillagefs.org/jobs/type/default/')

job_grid = soup.find('div',{'class':'wpjb-job-list'})

for job_div in job_grid.find_all('div',{'class':'wpjb-col-main'}):
    major_line = job_div.find('div',{'class':'wpjb-line-major'})
    job_title = major_line.a.text
    info_link = major_line.a['href']
    full_or_part = major_line.find('span',{'class':'wpjb-sub-title'}).text.strip()
    minor_line = job_div.find('div',{'class':'wpjb-line-minor'})
    job_location = minor_line.find('span',{'class':'wpjb-job_location'}).text.strip()
    date = minor_line.find('span',{'class':'wpjb-job_created_at'}).text.strip().split(', ')
    month = month_to_num(date[0])
    day = int(date[1])
    if month <= datetime.now().month:
        year = datetime.now().year
    else:
        year = datetime.now().year-1
    job_post_date = datetime(year, month, day)
    update_db(organization)
    reset_vars()

reset_vars()


# The Whole Child

organization = "The Whole Child"
soup = get_soup('https://www.thewholechild.info/about/careers-internships/')

jobs_div = soup.find('h3', text='Job Opportunities').parent

for job_div in jobs_div.find_all('li'):
    job_title = job_div.text
    info_link = job_div.a['href']
    update_db(organization)

reset_vars()


# Union Station Homeless Services

organization = "Union Station Homeless Services"
soup = get_soup('https://unionstationhs.org/about/employment/')

jobs_container = soup.find('dl',{'class':'employment-opportunities'})
info_link = 'https://unionstationhs.org/about/employment/'

for job_listing in jobs_container.find_all('dt'):
    job_heading = job_listing.h3.text.split(' Posted ')
    job_title = job_heading[0]
    date = job_heading[1].split(' ')
    month = month_to_num(date[0])
    day = int(date[1][0:len(date[1])-1])
    year = int(date[2])
    job_post_date = datetime(year, month, day)
    update_db(organization)

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
soup = get_soup('https://upwardboundhouse.org/about-us/careers/')

jobs_div = soup.find('h1', text='Careers').parent

for job_listing in jobs_div.find_all('a'):
    job_title = job_listing.text
    info_link = job_listing['href']
    update_db(organization)

reset_vars()


# Volunteers of America

organization = "Volunteers of America"

## SCRAPING CODE

reset_vars()


# Weingart Center Association

organization = "Weingart Center Association"
soup = get_soup('http://weingart.org/index.php/get-involved')

jobs_container = soup.find(text='Current Openings:').parent.parent.parent

for job_listing in jobs_container.find_all('a'):
    job_title = job_listing.text
    info_link = job_listing['href']
    update_db(organization)

reset_vars()


db.close()
