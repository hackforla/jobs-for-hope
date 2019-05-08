from bs4 import BeautifulSoup
from selenium import webdriver
import globals
from globals import get_javascript_soup_delayed_and_click, update_db, city_to_zip

# Hathaway-Sycamores Child and Family Services

organization = "Hathaway-Sycamores Child and Family Services"
url = 'https://www5.recruitingcenter.net/Clients/HathawaySycamores/PublicJobs/controller.cfm'

def run(url):
    ## Use Selenium browser to click on all positions button and get soup
    options = webdriver.ChromeOptions()
    options.add_argument('window-size=800x841')
    options.add_argument('headless')
    browser = webdriver.Chrome('../chromedriver', chrome_options=options)
    browser.get(url)
    python_button = browser.find_element_by_id('AllJobs')
    python_button.click()
    innerHTML = browser.execute_script("return document.body.innerHTML")
    soup = BeautifulSoup(innerHTML, "lxml")
    browser.quit()

    jobs_list = soup.find_all('tr')[2:]

    for job_entry in jobs_list:
        job_details = job_entry.find_all('td')
        globals.job_title = job_details[0].text.strip()
        globals.info_link = 'https://www5.recruitingcenter.net/Clients/HathawaySycamores/PublicJobs/' + job_details[0].a['href']
        location_details = job_details[2].text.strip()
        globals.full_or_part = job_details[4].text.strip()
        if location_details.isdigit():
            globals.job_zip_code = int(location_details)
            globals.job_location = zip_to_city(globals.job_zip_code)
        else:
            globals.job_location = location_details
            globals.job_zip_code = city_to_zip(globals.job_location)
        update_db(organization)
