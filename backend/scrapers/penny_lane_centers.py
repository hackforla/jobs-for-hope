import globals
from globals import clean_location, city_to_zip, get_soup, job_insert
from datecleaner import string_to_date
from job import Job
# Penny Lane Centers

organization = "Penny Lane Centers"
url = 'https://pennylanecenters.jobs.net/search'
organization_id = 39


def run(url):
    soup = get_soup(url)
    jobs_table = soup.find('table', {'id': 'job-result-table'})
    job_class = Job(organization, "")
    job_class.post_date = ""
    job_class.organization_id = organization_id
    insert_count = 0
    for job_row in jobs_table.find_all('tr', {'class': 'job-result'}):
        job_title_cell = job_row.find('td', {'class': 'job-result-title-cell'})
        job_class.title = job_title_cell.a.text.strip()
        job_class.info_link = 'https://pennylanecenters.jobs.net' + \
            job_title_cell.a['href']
        job_class.location = clean_location(
            job_row.find('div', {
                'class': 'job-location-line'
            }).text)
        job_class.zip_code = city_to_zip(job_class.location)
        # Get Job Soup
        job_soup = get_soup(job_class.info_link)
        job_class.full_or_part = job_soup.find('li', {
            'class': 'job-employee-type'
        }).find('div', {
            'class': 'secondary-text-color'
        }).text
        job_class.post_date = string_to_date(
            job_soup.find('li', {
                'class': 'job-date-posted'
            }).find('div', {
                'class': 'secondary-text-color'
            }).text)
        insert_count += job_insert(job_class)
    return insert_count
