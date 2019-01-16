from datetime import date, datetime, timedelta
import sqlite3
from bs4 import BeautifulSoup
import requests
from datecleaner import month_to_num, string_to_date
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from uszipcode import SearchEngine
import globals
search = SearchEngine()

organization = 'Los Angeles Homeless Services Authority'
url = 'https://www.governmentjobs.com/careers/lahsa'

def insert_job(values):
    query = "INSERT INTO jobs (org, date, job_title, job_summary, job_location, job_zip_code, job_post_date, full_or_part, salary, info_link) VALUES (?,date('now'),?,?,?,?,?,?,?,?)"
    try:
        globals.c.execute(query, values)
        globals.db.commit()
    except sqlite3.IntegrityError:
        globals.error_handler('SQL ERROR FOR QUERY: ' + query)


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
    insert_job((organization_name, globals.job_title, globals.job_summary, globals.job_location, globals.job_zip_code, globals.job_post_date, globals.full_or_part, globals.salary, globals.info_link))

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
    return int(search.by_city_and_state(location, 'CA')[0].zipcode)

def zip_to_city(cityzip):
    return search.by_zipcode(cityzip).major_city


def run(url):
    globals.job_post_date = ''
    next_page_url = url
    soup = get_javascript_soup_delayed(next_page_url,'job-table-title')
    #soup = get_javascript_soup('https://www.governmentjobs.com/careers/lahsa')

    while soup:
        job_table = soup.find('tbody')
        if not job_table:
            print('faild scraping page', next_page_url)
        else:
            print('page scraped', next_page_url)
        for job_row in job_table.find_all('tr'):
            globals.job_title = job_row.find('td',{'class':'job-table-title'}).a.text.strip()
            globals.info_link = 'https://www.governmentjobs.com' + job_row.find('td',{'class':'job-table-title'}).a['href']
            globals.salary = job_row.find('td',{'class':'job-table-salary'}).text
            globals.full_or_part = job_row.find('td',{'class':'job-table-type'}).text
            # Get soup for job listing to get more info
            job_soup = get_soup(globals.info_link)
            info_container = job_soup.find('div',{'class':'summary container'})
            globals.job_location = clean_location(info_container.find('div',{'id':'location-label-id'}).parent.find_all('div')[2].text)
            globals.job_zip_code = city_to_zip(globals.job_location)
            globals.job_summary = job_soup.find('div',{'id':'details-info'}).find('p').text
            update_db(organization)
            globals.reset_vars()
        if not 'disabled' in soup.find('li',{'class':'PagedList-skipToNext'}).get("class"):
            next_page_url = 'https://www.governmentjobs.com/careers/lahsa?' + soup.find('li',{'class':'PagedList-skipToNext'}).a['href'].split('?')[1]
            #soup = get_javascript_soup_delayed(next_page_url,'job-table-title')
            soup = get_javascript_soup(next_page_url)
        else:
            soup = False

