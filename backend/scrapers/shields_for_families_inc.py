from datecleaner import string_to_date
import globals
from globals import get_soup, get_javascript_soup, update_db, city_to_zip

# Shields For Families, Inc.
organization = "Shields For Families, Inc."
url = 'https://recruiting.paylocity.com/recruiting/jobs/List/1853/Shields-For-Families'


def run(url):
    soup = get_javascript_soup(url)

    job_listings = soup.find_all('div', {'class': 'job-listing-job-item'})

    for job_listing in job_listings:
        globals.job_title = job_listing.find(
            'span', {'class': 'job-item-title'}).a.text.strip()
        globals.info_link = 'https://recruiting.paylocity.com' + \
            job_listing.find('span', {'class': 'job-item-title'}).a['href']
        details = get_soup(globals.info_link)
        location = details.find('div', {'class': 'preview-location'})
        if location.a:
            globals.job_location = location.a.text
            zipcode = len(location.a['href'].split('+')[-1]) == 5
            try:
                globals.job_zip_code = int(zipcode)
            except ValueError:
                # generate a zip code if one is not available
                globals.job_zip_code = city_to_zip(globals.job_location)
        else:
            globals.job_location = ''
            globals.job_zip_code = ''
        globals.job_post_date = string_to_date(job_listing.find(
            'div', {'class': 'job-title-column'}).find_all('span')[1].text.split(' - ')[0])
        update_db(organization)
