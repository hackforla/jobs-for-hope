import globals
from datetime import datetime

# A Community of Friends
# JS-Rendered Page; Scraped with Selenium
organization = "A Community of Friends"
url = "https://recruiting.paylocity.com/recruiting/jobs/List/1438/A-COMMUNITY-OF-FRIENDS"

def run(url):
    soup = globals.get_javascript_soup(url)
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
        listing_soup = globals.get_soup(globals.info_link)
        listing_body = listing_soup.find('body').find_all('p')
        # Retrieve Full/Part-time and Salary info if available
        if 'Status' in listing_body[1].text:
            globals.full_or_part = listing_body[1].text[8:]
        if 'Salary' in listing_body[2].text:
            globals.salary = listing_body[2].text[14:]
        globals.update_db(organization)
        globals.reset_vars()