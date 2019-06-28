import globals
from globals import get_javascript_soup, job_insert
from job import Job
# Center for the Pacific Asian Family, Inc.

organization = 'Center for the Pacific Asian Family, Inc.'
url = 'http://nurturingchange.org/get-involved/employment/'
organization_id = 10


def run(url):
    soup = get_javascript_soup(url)
    jobs_list = soup.select('div.entry-content div.small-12.columns > p > a')
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list:
        job_class.title = job_entry.text
        job_class.info_link = job_entry['href']
        insert_count += job_insert(job_class)
    return insert_count
