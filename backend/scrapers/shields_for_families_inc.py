from datecleaner import string_to_date
import globals
from globals import get_soup, get_javascript_soup, job_insert, city_to_zip
from job import Job
# Shields For Families, Inc.
organization = "Shields For Families, Inc."
url = 'https://recruiting.paylocity.com/recruiting/jobs/List/1853/Shields-For-Families'
organization_id= 45

def run(url):
    soup = get_javascript_soup(url)

    job_listings = soup.find_all('div', {'class': 'job-listing-job-item'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_listing in job_listings:
        job_class.title = job_listing.find(
            'span', {'class': 'job-item-title'}).a.text.strip()
        job_class.info_link = 'https://recruiting.paylocity.com' + \
            job_listing.find('span', {'class': 'job-item-title'}).a['href']
        details = get_soup(job_class.info_link)
        location = details.find('div', {'class': 'preview-location'})
        if location.a:
            job_class.location = location.a.text
            zipcode = len(location.a['href'].split('+')[-1]) == 5
            try:
                job_class.zip_code = int(zipcode)
            except ValueError:
                # generate a zip code if one is not available
                job_class.zip_code = city_to_zip(job_class.location)
        else:
            job_class.location = ''
            job_class.zip_code = ''
        job_class.post_date = string_to_date(job_listing.find(
            'div', {'class': 'job-title-column'}).find_all('span')[1].text.split(' - ')[0])
        insert_count+= job_insert(job_class)
    return insert_count
