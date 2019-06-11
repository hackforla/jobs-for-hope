from bs4 import BeautifulSoup
from selenium import webdriver
import globals
from globals import get_javascript_soup_delayed_and_click, job_insert, city_to_zip, zip_to_city
from job import Job
# Hathaway-Sycamores Child and Family Services

organization = "Hathaway-Sycamores Child and Family Services"
url = 'https://www5.recruitingcenter.net/Clients/HathawaySycamores/PublicJobs/controller.cfm'
organization_id= 21

def run(url):
    # Use Selenium browser to click on all positions button and get soup
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

    jobs_list = soup.find_all('tr')[2:]
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count=0 
    for job_entry in jobs_list:
        job_details = job_entry.find_all('td')
        job_class.title = job_details[0].text.strip()
        job_class.info_link = 'https://www5.recruitingcenter.net/Clients/HathawaySycamores/PublicJobs/' + \
            job_details[0].a['href']
        job_class.full_or_part = job_details[4].text.strip()
        location_details = job_details[2].text.strip()
        if len(location_details) > 0:
            if location_details.isdigit():
                job_class.zip_code = int(location_details)
                job_class.location = zip_to_city(job_class.zip_code)
            else:
                job_class.location = location_details
                job_class.zip_code = city_to_zip(job_class.location)
        else:
            job_class.location = ''
            job_class.zip_code = ''
        insert_count+= job_insert(job_class)
    return insert_count