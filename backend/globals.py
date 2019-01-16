import sqlite3
from bs4 import BeautifulSoup
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from uszipcode import SearchEngine as search

# GLOBALS

c = ''
db = ''
organization_name = ''
job_title = ''
job_summary = ''
job_location = ''
job_zip_code = ''
job_post_date = ''
full_or_part = ''
salary = ''
info_link = ''

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
    print "Title: ", job_title
    print "Summary: ", job_summary
    print "Location: ", job_location
    print "Zip Code: ", job_zip_code
    print "Post Date: ", job_post_date
    print "Full or Part-Time: ", full_or_part
    print "Salary: ", salary
    print "Information: ", info_link

def create_table_jobs():
    query = 'CREATE TABLE IF NOT EXISTS jobs (date DATE, org VARCHAR, job_title VARCHAR, job_summary VARCHAR, job_location VARCHAR, job_zip_code VARCHAR, job_post_date DATE, full_or_part VARCHAR, salary VARCHAR, info_link VARCHAR)'
    try:
        c.execute(query)
        db.commit()
    except sqlite3.IntegrityError:
       error_handler('SQL ERROR FOR QUERY: ' + query)

def drop_table_jobs():
    query = 'DROP TABLE IF EXISTS jobs '
    try:
        c.execute(query)
        db.commit()
    except sqlite3.IntegrityError:
       error_handler('SQL ERROR FOR QUERY: ' + query)

def insert_job(values):
    query = "INSERT INTO jobs (org, date, job_title, job_summary, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link) VALUES (?,date('now'),?,?,?,?,?,?,?,?)"
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
    insert_job((organization_name, job_title, job_summary, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link))

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

def city_to_zip(location):
    return int(search().by_city_and_state(location, 'CA')[0].zipcode)

def zip_to_city(cityzip):
    return search().by_zipcode(cityzip).major_city

