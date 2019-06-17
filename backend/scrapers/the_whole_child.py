from datetime import datetime
import globals
from globals import get_javascript_soup, job_insert
from job import Job
# The Whole Child

organization = "The Whole Child"
url = 'https://www.thewholechild.org/about/careers-internships/'
organization_id= 56

def run(url):
    soup = get_javascript_soup(url)

    jobs_list = soup.find('h3', text='Job Opportunities').next_sibling
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list.find_all('li'):
        job_class.title = job_entry.text
        job_class.info_link = job_entry.a['href']
        insert_count+= job_insert(job_class)
    return insert_count
