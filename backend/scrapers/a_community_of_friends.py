import globals
from globals import get_soup, get_javascript_soup, job_insert
from datetime import datetime
from job import Job
import re

# A Community of Friends
# JS-Rendered Page; Scraped with Selenium
organization = "A Community of Friends"
url = "https://recruiting.paylocity.com/recruiting/jobs/List/1438/A-COMMUNITY-OF-FRIENDS"
organization_id= 2

def run(url):
    soup = get_javascript_soup(url)
    job_listings = soup.find_all('div', {'class': 'job-listing-job-item'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count=0
    for job_listing in job_listings:
        job_description = job_listing.find_all('span')
        # Get job title and link
        job_class.title = job_description[0].a.text
        job_class.info_link = 'https://recruiting.paylocity.com' + \
            job_description[0].a['href']
        # Get date as string
        date = job_description[1].text
        # Clean up date string by removing trailing -'s, then split and convert
        # to datetime object
        if date[len(date) - 2] == '-':
            date = date[0:len(date) - 3]
        date = date.strip().split('/')
        month = int(date[0])
        day = int(date[1])
        year = int(date[2])
        job_class.post_date = datetime(year, month, day)
        # Get Location
        job_class.location = job_listing.find(
            'div', {'class': 'location-column'}).span.text
        # Get soup of job listing to scrape more info
        listing_soup = get_soup(job_class.info_link)
        listing_body = listing_soup.find('body').find_all('p')
        # Retrieve Full/Part-time and Salary info if available
        if 'Location' in listing_body[0].text:
            location_string = listing_body[0].text.split(':')[1].lstrip()
            zip_code_result = re.search(r'(\d{5})', location_string)
            if zip_code_result is not None:
                job_class.zip_code = zip_code_result.group(1)
            # can't get city since there's no standard. It could be
            # "Hollywood", "Koreatown, Los angeles, California", or even
            # "Multiple Locations"
        if len(job_class.zip_code) == 0:
            job_class.zip_code = globals.city_to_zip(job_class.location)
        if 'Status' in listing_body[1].text:
            job_class.full_or_part = listing_body[1].text[8:]
        if 'Salary' in listing_body[2].text:
            job_class.salary = listing_body[2].text[14:]
        insert_count+=job_insert(job_class)
    return insert_count
