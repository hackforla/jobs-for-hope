import globals
from globals import get_javascript_soup, job_insert
from job import Job
# Skid Row Housing Trust

organization = "Skid Row Housing Trust"
url = 'https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=37F34A94DC3DBD8AA2C5ACCA82E66F1E&jpt=#'
organization_id= 46

def run(url):
    soup = get_javascript_soup(url)

    job_listings = soup.find_all('div', {'class': 'jobInfo'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_listing in job_listings:
        job_class.title = job_listing.find(
            'span', {'class': 'jobTitle'}).a.text.strip()
        job_class.info_link = 'https://www.paycomonline.net' + \
            job_listing.find('span', {'class': 'jobTitle'}).a['href']
        if job_listing.find('span', {'class': 'jobLocation'}).text:
            job_class.location = globals.clean_location(job_listing.find(
                'span', {'class': 'jobLocation'}).text.split(' - ')[1])
            job_class.zip_code = globals.city_to_zip(job_class.location)
        if job_listing.find('span', {'class': 'jobDescription'}).text:
            job_class.summary = job_listing.find(
                'span', {'class': 'jobDescription'}).text.strip()
        if job_listing.find('span', {'class': 'jobType'}).text:
            if ('ft' in str(job_listing.find('span', {'class': 'jobType'}).text).lower()) or (
                    'full' in str(job_listing.find('span', {'class': 'jobType'}).text).lower()):
                job_class.full_or_part = 'full'
            else:
                job_class.full_or_part = 'part'
        insert_count+= job_insert(job_class)
    return insert_count
