from bs4 import BeautifulSoup
import requests
from datetime import date, datetime, timedelta
from datecleaner import month_to_num, string_to_date
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from uszipcode import SearchEngine
search = SearchEngine()

organization = 'Los Angeles Homeless Services Authority'
url = 'https://www.governmentjobs.com/careers/lahsa'

def insert_job(values):
    global c
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

def get_javascript_soup_delayed_and_click(url, dynamicElement):
    driver = webdriver.Chrome('./chromedriver')
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
    return int(search.by_city_and_state(location, 'CA')[0].zipcode)

def zip_to_city(cityzip):
    return search.by_zipcode(cityzip).major_city


def run(url):
    global job_title
    global info_link
    global salary
    global full_or_part
    global job_location
    global job_zip_code
    global job_summary

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
            #soup = get_javascript_soup_delayed(next_page_url,'job-table-title')
            soup = get_javascript_soup(next_page_url)
        else:
            soup = False

