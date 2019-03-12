# vim: set fileencoding=utf8
# Editor configs above to save file in Unicode since this file contains
# non-ASCII characters
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
import re
from uszipcode import SearchEngine
search = SearchEngine()

# CONSTANTS

pdf_message = 'See PDF document.'

# FUNCTIONS

def error_handler(error_msg):
    print error_msg
    exit()

def reset_vars():
    global job_title
    global job_summary
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link
    
    job_title = ""
    job_summary = ""
    job_location = ""
    job_zip_code = ""
    job_post_date = ""
    full_or_part = ""
    salary = ""
    info_link = ""

def print_vars():
    global job_title
    global job_summary
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link
    
    print "Title: ", job_title
    print "Summary: ", job_summary
    print "Location: ", job_location
    print "Zip Code: ", job_zip_code
    print "Post Date: ", job_post_date
    print "Full or Part-Time: ", full_or_part
    print "Salary: ", salary
    print "Information: ", info_link

def create_table_jobs():
    global c
    query = '''
    CREATE TABLE IF NOT EXISTS jobs (
        date DATE,
        organization_id INTEGER NOT NULL,
        job_title VARCHAR,
        job_summary VARCHAR,
        job_location VARCHAR,
        job_zip_code VARCHAR,
        job_post_date DATE,
        full_or_part VARCHAR,
        salary VARCHAR,
        info_link VARCHAR,
        FOREIGN KEY (organization_id) REFERENCES organizations (id)
    ) '''
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
    query = '''
    INSERT INTO jobs (job_title, organization_id, date, job_summary, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link)
    VALUES (?,?,date('now'),?,?,?,?,?,?,?) '''
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
    options = webdriver.ChromeOptions()
    options.add_argument('window-size=800x841')
    options.add_argument('headless')
    driver = webdriver.Chrome('./chromedriver', chrome_options=options)
    driver.implicitly_wait(10)
    driver.get(url)
    innerHTML = driver.execute_script("return document.body.innerHTML")
    driver.quit()
    return BeautifulSoup(innerHTML, "lxml")

def get_javascript_soup_delayed(url, dynamicElement):
    options = webdriver.ChromeOptions()
    options.add_argument('window-size=800x841')
    options.add_argument('headless')
    driver = webdriver.Chrome('./chromedriver', chrome_options=options)
    driver.get(url)
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, dynamicElement))
        )
    finally:
        innerHTML = driver.execute_script("return document.body.innerHTML")
        driver.quit()
        return BeautifulSoup(innerHTML, "lxml")

def get_javascript_soup_delayed_and_click(url, dynamicElement):
    options = webdriver.ChromeOptions()
    options.add_argument('window-size=800x841')
    options.add_argument('headless')
    driver = webdriver.Chrome('./chromedriver', chrome_options=options)
    driver.get(url)
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, dynamicElement))
        )
    finally:
        element.click()
        innerHTML = driver.execute_script("return document.body.innerHTML")
        driver.quit()
        return BeautifulSoup(innerHTML, "lxml")

def update_db(organization_name):
    global job_title
    global job_summary
    global job_location
    global job_zip_code
    global job_post_date
    global full_or_part
    global salary
    global info_link
    organization_id = select_organization_id_by_name(organization_name)
    insert_job((job_title, organization_id[0], job_summary, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link))

def date_ago(timeLength, timeUnit):
    timeUnit = timeUnit.strip().lower()
    today = datetime.today()
    if timeUnit[:4] == 'hour':
        return today - timedelta(hours=timeLength)
    elif timeUnit[:3] == 'day':
        return today - timedelta(days=timeLength)
    elif timeUnit[:5] == 'month':
        return today - timedelta(days=30*timeLength)
    elif timeUnit[:4] == 'year':
        return today - timedelta(days=365*timeLength)

def clean_location(string):
    return string.split(',')[0].strip()

def city_to_zip(location):
    return int(search.by_city_and_state(location, 'CA')[0].zipcode)

def zip_to_city(cityzip):
    return search.by_zipcode(cityzip).major_city

def select_organization_id_by_name(name):
    global c
    c.execute("SELECT id from organizations WHERE name=?", [name])

    rows = c.fetchall()
    return rows[0]

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
        job_summary = pdf_message
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
    job_summary = info_link
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
    if 'Location' in listing_body[0].text:
        location_string = listing_body[0].text.split(':')[1].lstrip()
        zip_code_result = re.search(r'(\d{5})', location_string)
        if zip_code_result != None:
            job_zip_code = zip_code_result.group(1)
        # can't get city since there's no standard. It could be
        # "Hollywood", "Koreatown, Los angeles, California", or even
        # "Multiple Locations"
    if len(job_zip_code) == 0:
        job_zip_code = city_to_zip(job_location)
    if 'Status' in listing_body[1].text:
        full_or_part = listing_body[1].text[8:]
    if 'Salary' in listing_body[2].text:
        salary = listing_body[2].text[14:]
    update_db(organization)
    reset_vars()

reset_vars()

# Alliance for Housing and Healing (Formerly the Serra Project & Aid For Aids)

organization = "Alliance for Housing and Healing"
soup = get_soup("https://alliancehh.org/about/jobs/")

for html_element in soup.find_all('h4'):
    job_title = html_element.a.text
    info_link = html_element.a['href']
    job_summary = info_link
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

    job_summary = info_link
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
    job_summary = pdf_message
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
    job_summary = info_link
    job_location = job_container.find("span",{"class","js-job-location"}).text.strip()

    job_soup = get_soup(info_link)
    full_or_part = job_soup.find("h2", {"class":"js-subtitle"}).text.split(' | ')[2]
    update_db(organization)

reset_vars()


# Catholic Charities Of Los Angeles, Inc.

organization = "Catholic Charities Of Los Angeles, Inc."
url = "https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang"
options = webdriver.ChromeOptions()
options.add_argument('window-size=800x841')
options.add_argument('headless')
catholicDriver = webdriver.Chrome('./chromedriver', chrome_options=options)
catholicDriver.get(url)

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
    elif (posted_ago[0] == '30+'):
        # over 30 days ago
        job_post_date = date_ago(31, posted_ago[1])
    else:
        job_post_date = date_ago(int(posted_ago[0]), posted_ago[1])
    if (opening_detail.find('span', {'class':'current-opening-worker-catergory'})):
        full_or_part = opening_detail.find('span', {'class':'current-opening-worker-catergory'}).text.strip()
    info_link = 'https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=b4842dc2-cd32-4f0f-88d3-b259fbc96f09&ccId=19000101_000001&type=MP&lang'
    job_summary = info_link
    update_db(organization)
    reset_vars()

reset_vars()


# Center for the Pacific Asian Family, Inc.

organization = "Center for the Pacific Asian Family, Inc."
soup = get_soup("http://nurturingchange.org/get-involved/employment/")
jobs_list = soup.select('div.entry-content div.small-12.columns > p > a')

for job_entry in jobs_list:
    job_title = job_entry.text
    info_link = job_entry['href']
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
    job_summary = info_link
    job_location = job_details[2].text
    update_db(organization)
    reset_vars()

reset_vars()


# City of Pomona

organization = "City of Pomona"
soup = get_javascript_soup_delayed('http://agency.governmentjobs.com/pomona/default.cfm','jobtitle')

jobs_table = soup.find('table',{'class':'table'})

for job_entry in jobs_table.find('tbody').find_all('tr'):
    job_details = job_entry.find_all('td')
    job_title = job_details[0].find('a').text.strip()
    info_link = 'http://agency.governmentjobs.com/pomona/' + job_details[0].find('a')['href']
    job_summary = info_link
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
    job_summary = info_link
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
            job_summary = info_link
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
        job_summary = info_link
        job_soup = get_soup(info_link)
        job_details = job_soup.find('div',{'aria-label':'Job Details'})
        if job_details:
            job_location = job_details.find('span',{'aria-label':'Job Location'}).text
            salary = job_details.find('span',{'aria-label':'Salary Range'}).text
        update_db(organization)
        reset_vars()

reset_vars()


# East San Gabriel Valley Coalition for the Homeless

organization = "East San Gabriel Valley Coalition for the Homeless"

## Only 1 job listing and it's poorly formatted; skip?
## SCRAPING CODE

reset_vars()


# Exodus Recovery, Inc.

organization = "Exodus Recovery, Inc."
url = 'https://www.exodusrecovery.com/employment/'
soup = get_javascript_soup(url)

scraping = True

while scraping:
    job_posts = soup.find_all('article',{'class':'et_pb_post'})
    for post in job_posts:
        job_entry = post.find('h2',{'class':'entry-title'})
        job_title = job_entry.text
        info_link = job_entry.a['href']
        job_summary = post.find('div',{'class':'post-content'}).p.text
        update_db(organization)
        reset_vars()
    ## Check if more job entries on website to scrape
    if soup.find(text="« Older Entries"):
        soup = get_javascript_soup(soup.find(text="« Older Entries").parent['href'])
    else:
        scraping = False

reset_vars()


# Harbor Interfaith Services, Inc.

organization = "Harbor Interfaith Services, Inc."

## BAD WEBSITE?
## SCRAPING CODE

reset_vars()


# Hathaway-Sycamores Child and Family Services

organization = "Hathaway-Sycamores Child and Family Services"
url = 'https://www5.recruitingcenter.net/Clients/HathawaySycamores/PublicJobs/controller.cfm'

## Use Selenium browser to click on all positions button and get soup
options = webdriver.ChromeOptions()
options.add_argument('window-size=800x841')
options.add_argument('headless')
browser = webdriver.Chrome('./chromedriver', chrome_options=options)
browser.get(url)
python_button = browser.find_element_by_id('AllJobs')
python_button.click()
innerHTML = browser.execute_script("return document.body.innerHTML")
soup = BeautifulSoup(innerHTML, "lxml")
browser.quit()

for row in soup.find_all('tr')[2:]:
    job_details = row.find_all('td')
    job_title = job_details[0].text.strip()
    info_link = 'https://www5.recruitingcenter.net/Clients/HathawaySycamores/PublicJobs/' + job_details[0].a['href']
    location_details = job_details[2].text.strip()
    full_or_part = job_details[4].text.strip()
    if location_details.isdigit():
        job_zip_code = int(location_details)
        job_location = zip_to_city(job_zip_code)
    else:
        job_location = location_details
        job_zip_code = city_to_zip(job_location)
    update_db(organization)
    reset_vars()


reset_vars()


# Homeless Health Care Los Angeles

organization = "Homeless Health Care Los Angeles"

## Can't scrape; website formatting is too sloppy and not standardized
## SCRAPING CODE

reset_vars()


# Housing Works

organization = "Housing Works"

## Can't scrape; no job listings
## SCRAPING CODE

reset_vars()


# Illumination Foundation

organization = "Illumination Foundation"
soup = get_soup('https://www.ifhomeless.org/careers/')

job_listings = soup.find_all('div',{'class':'list-data'})

for listing in job_listings:
    job_info = listing.find('div',{'class':'job-info'})
    job_title = job_info.find('span',{'class':'job-title'}).text.strip()
    info_link = job_info.h4.a['href']
    full_or_part = listing.find('div',{'class':'job-type'}).text.strip()
    job_location = clean_location(listing.find('div',{'class':'job-location'}).text.strip())
    job_zip_code = city_to_zip(job_location)
    relative_date = listing.find('div',{'class':'job-date'}).text.strip().split(' ')
    job_post_date = date_ago(int(relative_date[1]), relative_date[2])
    job_summary = listing.find('div',{'class':'job-description'}).p.text.strip()
    update_db(organization)
    reset_vars()

reset_vars()


# Inner City Law Center

organization = "Inner City Law Center"

## PROBLEM: mostly law jobs / not entry level; poorly formatted website; job info is in PDF, so we can only scrape job title + link
## Code below scrapes most of the listings correctly, but there are some listings that say 'Click Here' instead of job title because of poor formatting of website

# soup = get_soup('http://www.innercitylaw.org/careers/')

# job_listings = soup.find('div',{'class':'entry-content'}).find('ul')

# for listing in job_listings.find_all('li'):
#     job_title = listing.a.text
#     info_link = listing.a['href']
#     update_db(organization)
#     reset_vars()


reset_vars()


# Jewish Family Service of Los Angeles

organization = "Jewish Family Service of Los Angeles"
soup = get_javascript_soup('https://chm.tbe.taleo.net/chm02/ats/careers/searchResults.jsp?org=JFSLA&cws=1&org=JFSLA')

jobs_table = soup.find('table',{'id':'cws-search-results'})

for job_row in jobs_table.find_all('tr')[1:]:
    row_cells = job_row.find_all('td')
    job_title = row_cells[1].a.text.strip()
    info_link = row_cells[1].a['href']
    job_location = clean_location(row_cells[2].text)
    job_zip_code = city_to_zip(job_location)
    job_soup = get_soup(info_link)
    full_or_part = job_soup.find(text="Employment Duration:").parent.parent.b.text.strip()
    update_db(organization)
    reset_vars()

reset_vars()


# Jovenes, Inc.

organization = "Jovenes, Inc."

## PROBLEM: Site not working / no jobs
## SCRAPING CODE

reset_vars()


# JWCH Institute, Inc.

organization = "JWCH Institute"
soup = get_soup('http://jwchinstitute.org/about-us/work-at-jwch/')

jobs_list = soup.find('ul',{'class':'lcp_catlist'})

for job_entry in jobs_list.find_all('li'):
    job_title = job_entry.a.text.strip()
    info_link = job_entry.a['href']
    job_soup = get_soup(info_link)
    job_summary = job_soup.find(text=re.compile("Position Purpose:")).parent.parent.text
    update_db(organization)
    reset_vars()

reset_vars()


# LA Family Housing Corporation

organization = "LA Family Housing Corporation"
soup = get_soup('https://lafh.org/employment-at-lafh/')

jobs_div = soup.find('div',{'class':'sqs-block-content'})
job_items = jobs_div.find_all('p')

for job_item in job_items[3:len(job_items)-2]:
    job_title = job_item.a.text.strip()
    info_link = 'https://lafh.org' + job_item.a['href']
    update_db(organization)

reset_vars()


# LifeSTEPS - Life Skills Training & Educational Programs

organization = "LifeSTEPS - Life Skills Training & Educational Programs"

## PROBLEM: Can't scrape - no jobs listed
## SCRAPING CODE

reset_vars()


# Los Angeles Centers For Alcohol and Drug Abuse

organization = "Los Angeles Centers For Alcohol and Drug Abuse"
soup = get_soup('http://www.lacada.com/2018/career-opportunities/')

jobs_list = soup.select('div.wpb_wrapper > p > a')

for job_opening in jobs_list:
    job_title = job_opening.text.strip()
    info_link = job_opening['href']
    update_db(organization)
    reset_vars()

reset_vars()


# Los Angeles Gay & Lesbian Community Services Center

organization = "Los Angeles Gay & Lesbian Community Services Center"
soup = get_javascript_soup('https://lalgbtcenter.org/about-the-center/careers')

job_divs = soup.find_all('div', {'class':'ui-accordion-content'})

for job_div in job_divs:
    for job_listing in job_div.find_all('li'):
        job_title = job_listing.text.strip()
        info_link = 'https://lalgbtcenter.org' + job_listing.find_all('a')[-1]['href']
        update_db(organization)
        reset_vars()

job_lists = soup.find_all('ul', {'class':'ui-accordion-content'})

for job_list in job_lists:
    for job_listing in job_list.find_all('li'):
        job_title = job_listing.text.strip()
        info_link = 'https://lalgbtcenter.org' + job_listing.find_all('a')[-1]['href']
        update_db(organization)
        reset_vars()

reset_vars()


# Los Angeles Homeless Services Authority

organization = "Los Angeles Homeless Services Authority"
soup = get_javascript_soup_delayed('https://www.governmentjobs.com/careers/lahsa', 'job-table-title')

while soup:
    job_table = soup.find('tbody')
    for job_row in job_table.find_all('tr'):
        job_title = job_row.find('td',{'class':'job-table-title'}).a.text.strip()
        info_link = 'https://www.governmentjobs.com' + job_row.find('td',{'class':'job-table-title'}).a['href']
        salary = job_row.find('td',{'class':'job-table-salary'}).text
        full_or_part = job_row.find('td',{'class':'job-table-type'}).text
        # Get soup for job listing to get more info
        job_soup = get_soup(info_link)
        info_container = job_soup.find('div',{'class':'summary container'})
        job_location = clean_location(info_container.find('div',{'id':'location-label-id'}).parent.find_all('div')[2].text)
        job_zip_code = city_to_zip(job_location)
        job_summary = job_soup.find('div',{'id':'details-info'}).find('p').text
        update_db(organization)
        reset_vars()
    if not 'disabled' in soup.find('li',{'class':'PagedList-skipToNext'}).get("class"):
        next_page_url = 'https://www.governmentjobs.com/careers/lahsa?' + soup.find('li',{'class':'PagedList-skipToNext'}).a['href'].split('?')[1]
        soup = get_javascript_soup_delayed(next_page_url, 'job-table-title')
    else:
        soup = False

reset_vars()


# Lutheran Social Services

organization = "Lutheran Social Services"

## PROBLEM: Website has no job listings?
## SCRAPING CODE

reset_vars()


# Mental Health America of Los Angeles

organization = "Mental Health America of Los Angeles"

url = 'http://mhala.hrmdirect.com/employment/job-openings.php?nohd'

soup = get_javascript_soup_delayed_and_click(url, 'hrmSearchButton')

job_listings = soup.find_all('tr',{'class':'ReqRowClick'})

for job_row in job_listings:
    job_title = job_row.find('td',{'class':'posTitle'}).text.strip()
    info_link = 'http://mhala.hrmdirect.com/employment/' + job_row.find('td',{'class':'posTitle'}).a['href']
    job_location = job_row.find('td',{'class':'cities'}).text
    job_zip_code = city_to_zip(job_location)
    job_soup = get_soup(info_link)
    summary = job_soup.find(string=["Summary:", "Summary: "])
    if summary:
        summary_parent = summary.parent
        summary_parent.clear()
        job_summary = summary_parent.find_parent("p").text.strip()
    else:
        job_summary = info_link
    update_db(organization)
    reset_vars()

reset_vars()


# National Health Foundation

organization = "National Health Foundation"
soup = get_soup('http://nationalhealthfoundation.org/careers/')

job_listings = soup.find('div',{'class':'tf-sh-78847e2ef97967b68fdec32a2997ab8f'})

for job_item in job_listings.find_all('a'):
    job_title = job_item.text.strip()
    info_link = job_item['href']
    update_db(organization)
    reset_vars()

reset_vars()


# Neighborhood Legal Services of Los Angeles County

organization = "Neighborhood Legal Services of Los Angeles County"
soup = get_soup('http://www.nlsla.org/current-employment-opportunities/')

job_listings = soup.find('article').find_all('a')

for job_item in job_listings:
    job_title = job_item.text.strip()
    info_link = 'http://www.nlsla.org/current-employment-opportunities/' + job_item['href']
    update_db(organization)
    reset_vars()

reset_vars()


# New Directions For Veterans, Inc.

organization = "New Directions For Veterans"

## PROBLEM: Site poorly written for scraping and only has 3 listings
## SCRAPING CODE

reset_vars()


# Penny Lane Centers

organization = "Penny Lane Centers"
soup = get_soup('https://pennylanecenters.jobs.net/search')

jobs_table = soup.find('table',{'id':'job-result-table'})

for job_row in jobs_table.find_all('tr',{'class':'job-result'}):
    job_title_cell = job_row.find('td',{'class':'job-result-title-cell'})
    job_title = job_title_cell.a.text.strip()
    info_link = 'https://pennylanecenters.jobs.net' + job_title_cell.a['href']
    job_location = clean_location(job_row.find('div',{'class':'job-location-line'}).text)
    job_zip_code = city_to_zip(job_location)
    # Get Job Soup
    job_soup = get_soup(info_link)
    full_or_part = job_soup.find('li',{'class':'job-employee-type'}).find('div',{'class':'secondary-text-color'}).text
    job_post_date = string_to_date(job_soup.find('li',{'class':'job-date-posted'}).find('div',{'class':'secondary-text-color'}).text)
    update_db(organization)
    reset_vars()

reset_vars()


# People Assisting the Homeless (PATH)
organization = "People Assisting the Homeless"
soup = get_soup('https://path.catsone.com/careers')

jobs_table = soup.find('div',{'class':'JobGrid-etzr7g-4'})

for job_entry in jobs_table.find_all('a'):
    info_link = 'https://path.catsone.com' + job_entry['href']
    job_row = job_entry.find('div',{'class':'row'})
    job_divs = job_row.find_all('div')
    job_title = job_divs[0].text.strip()
    job_location = clean_location(job_divs[2].text.strip())
    job_zip_code = city_to_zip(job_location)
    update_db(organization)
    reset_vars()
    # Possible to get more info by scraping each job link, but the listings are extremely poorly written/standardized; scraper below works for most of the listings, but a few poorly written listings break the scraper
    # job_soup = get_soup(info_link)
    # job_description = job_soup.find('div',{'class':'Job__StyledDescription-s1h17u0t-0'})
    # if '\n' in job_description.find_all('strong')[0].text:
    #     full_or_part = job_description.find_all('strong')[0].text.split('\n')[1].strip()
    #     salary = job_description.find_all('strong')[0].text.split('\n')[2].strip().split(': ')[1]
    # else:
    #     full_or_part = job_description.find_all('strong')[1].text.strip()
    #     salary = job_description.find_all('strong')[2].text.split('\n')[0].split(':')[1].strip()

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
        job_summary = info_link
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
    listing_element = job_listing.find_all('a')
    if len(listing_element) > 0:
        job_title = listing_element[0].text
        info_link = listing_element[0]['href']
        job_summary = pdf_message
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
    job_summary = info_link
    job_location = html_element.span.text.split(']')[1]
    update_db(organization)
    reset_vars()

reset_vars()


# Shields For Families, Inc.

organization = "Shields For Families"
soup = get_javascript_soup('https://recruiting.paylocity.com/recruiting/jobs/List/1853/Shields-For-Families')

job_listings = soup.find_all('div',{'class':'job-listing-job-item'})

for job_listing in job_listings:
    job_title = job_listing.find('span', {'class':'job-item-title'}).a.text.strip()
    info_link = 'https://recruiting.paylocity.com' + job_listing.find('span', {'class':'job-item-title'}).a['href']
    if job_listing.find('div',{'class':'location-column'}).text:
        job_location = job_listing.find('div',{'class':'location-column'}).text
        job_zip_code = city_to_zip(job_location)
    job_post_date = string_to_date(job_listing.find('div',{'class':'job-title-column'}).find_all('span')[1].text.split(' - ')[0])
    update_db(organization)
    reset_vars()

reset_vars()


# Skid Row Housing Trust

organization = "Skid Row Housing Trust"
soup = get_javascript_soup('https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=37F34A94DC3DBD8AA2C5ACCA82E66F1E&jpt=#')

job_listings = soup.find_all('div', {'class':'jobInfo'})

for job_listing in job_listings:
    job_title = job_listing.find('span', {'class':'jobTitle'}).a.text.strip()
    info_link = 'https://www.paycomonline.net' + job_listing.find('span',{'class':'jobTitle'}).a['href']
    if job_listing.find('span', {'class':'jobLocation'}).text:
        job_location = clean_location(job_listing.find('span', {'class':'jobLocation'}).text.split(' - ')[1])
        job_zip_code = city_to_zip(job_location)
    if job_listing.find('span', {'class':'jobDescription'}).text:
        job_summary = job_listing.find('span', {'class':'jobDescription'}).text.strip()
    if job_listing.find('span', {'class':'jobType'}).text:
        if  ('ft' in str(job_listing.find('span', {'class':'jobType'}).text).lower()) or ('full' in str(job_listing.find('span', {'class':'jobType'}).text).lower()):
            full_or_part = 'full'
        else:
            full_or_part = 'part'
    update_db(organization)
    reset_vars()

reset_vars()


'''
# FIXME
# XXX timeout
# Special Service for Groups, Inc.

organization = "Special Service for Groups"
soup = get_soup('http://www.ssg.org/about-us/careers/')
article = soup.find('article')

for html_element in article.find_all('p'):
    if 'Posted ' in html_element.text:
        job_element = html_element.find('a')
        job_title = job_element.text
        info_link = job_element['href']
        job_summary = info_link
        date = html_element.text.split('Posted ')[1].split('/')
        month = int(date[0])
        day = int(date[1])
        year = int(date[2])
        job_post_date = datetime(year, month, day)
        update_db(organization)
        reset_vars()

reset_vars()


# FIXME
# XXX new website coming soon
# St. Joseph Center

organization = "St. Joseph Center"
soup = get_javascript_soup('https://stjosephctr.org/careers/')

jobs_table = soup.find('table',{'class':'srJobList'}).tbody.find_all('tr')[1:]

for job_entry in jobs_table:
    job_title = job_entry.find('td',{'class':'srJobListJobTitle'}).text.strip()
    onClickLink = job_entry['onclick']
    info_link = onClickLink[13:len(onClickLink)-3]
    full_or_part = job_entry.find('td',{'class':'srJobListTypeOfEmployment'}).text
    job_location = clean_location(job_entry.find('td',{'class':'srJobListLocation'}).text)
    job_zip_code = city_to_zip(job_location)
    update_db(organization)
    reset_vars()

reset_vars()
'''


# Step Up on Second Street, Inc.

organization = "Step Up on Second Street"
url = "https://www.indeedjobs.com/step-up-on-second-street-inc/jobs"
soup = get_javascript_soup(url)


###
current_openings = soup.findAll(attrs={"data-tn-element" : "jobLink[]"})

for current_opening in current_openings:

    detail_page_link = current_opening.find('a')['href']
    detail_page_soup = get_soup(detail_page_link)
    detail_page_desc = detail_page_soup.find('div', {"data-tn-component": "jobDescription"})

    job_title = detail_page_desc.find('h1').text.strip()

    job_summary_parts = detail_page_desc.findAll(['p', 'li'])
    job_summary = ' '.join(map(lambda a : a.getText(), job_summary_parts[1:-1])).strip()

    job_location = detail_page_desc.find('dt' , string="Location").findNext().get_text()
    job_zip_code = city_to_zip(job_location)

    posted_ago = job_summary_parts[-1].get_text().split(' ')
    length = posted_ago[1]
    if (length[-1:] == '+'):
        length = length[:1]
    length = int(length)
    unit = posted_ago[2]
    job_post_date = date_ago(length, unit)

    full_or_part = detail_page_desc.find('dt' , string="Job Type").findNext().get_text()

    salary_search = detail_page_desc.find('dt' , string="Salary")
    if (salary_search is not None):
        salary = salary_search.findNext().get_text()
    else:
        salary = ""

    info_link = detail_page_link

    update_db(organization)
    reset_vars()

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
    job_summary = info_link
    update_db(organization)

reset_vars()


# The People Concern (Formerly OPCC & LAMP)

organization = "The People Concern"
soup = get_javascript_soup('https://theapplicantmanager.com/careers?co=lc')

jobs_table = soup.find('table',{'id':'careers_table'}).tbody.find_all('tr')

for job_row in jobs_table:
    job_entry = job_row.find_all('td')
    job_title = job_entry[0].a.text
    info_link = 'https://theapplicantmanager.com/' + job_entry[0].a['href']
    job_location = job_entry[1].text
    full_or_part = job_entry[3].text
    job_post_date = job_entry[4].text
    update_db(organization)
    reset_vars()

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
    job_summary = info_link
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
soup = get_javascript_soup('https://www.thewholechild.org/about/careers-internships/')

jobs_div = soup.find('h3', text='Job Opportunities').next_sibling

for job_div in jobs_div.find_all('li'):
    job_title = job_div.text
    info_link = job_div.a['href']
    job_summary = info_link
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
    job_summary = job_listing.p.text
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
    job_summary = pdf_message
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
    job_summary = info_link
    update_db(organization)

reset_vars()


db.close()
