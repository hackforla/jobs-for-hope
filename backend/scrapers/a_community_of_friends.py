import globals
from globals import get_soup, get_javascript_soup, update_db, reset_vars
from datetime import datetime
import re

# A Community of Friends
# JS-Rendered Page; Scraped with Selenium
organization = "A Community of Friends"
url = "https://recruiting.paylocity.com/recruiting/jobs/List/1438/A-COMMUNITY-OF-FRIENDS"

def run(url):
    soup = get_javascript_soup(url)
    job_listings = soup.find_all('div',{'class':'job-listing-job-item'})

    for job_listing in job_listings:
        job_description = job_listing.find_all('span')
        # Get job title and link
        globals.job_title = job_description[0].a.text
        globals.info_link = 'https://recruiting.paylocity.com' + job_description[0].a['href']
        globals.job_summary = globals.info_link
        # Get date as string
        date = job_description[1].text
        # Clean up date string by removing trailing -'s, then split and convert to datetime object
        if date[len(date)-2] == '-':
            date = date[0:len(date)-3]
        date = date.strip().split('/')
        month = int(date[0])
        day = int(date[1])
        year = int(date[2])
        globals.job_post_date = datetime(year, month, day)
        # Get Location
        globals.job_location = job_listing.find('div',{'class':'location-column'}).span.text
        # Get soup of job listing to scrape more info
        listing_soup = get_soup(globals.info_link)
        listing_body = listing_soup.find('body').find_all('p')
        # Retrieve Full/Part-time and Salary info if available
        if 'Location' in listing_body[0].text:
            location_string = listing_body[0].text.split(':')[1].lstrip()
            zip_code_result = re.search(r'(\d{5})', location_string)
            if zip_code_result != None:
                globals.job_zip_code = zip_code_result.group(1)
            # can't get city since there's no standard. It could be
            # "Hollywood", "Koreatown, Los angeles, California", or even
            # "Multiple Locations"
        if len(globals.job_zip_code) == 0:
            globals.job_zip_code = globals.city_to_zip(globals.job_location)
        if 'Status' in listing_body[1].text:
            globals.full_or_part = listing_body[1].text[8:]
        if 'Salary' in listing_body[2].text:
            globals.salary = listing_body[2].text[14:]
        update_db(organization)
        reset_vars()
