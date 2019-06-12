import globals
from globals import get_javascript_soup, job_insert
from job import Job
# Los Angeles Centers For Alcohol and Drug Abuse

organization = "Los Angeles Centers For Alcohol and Drug Abuse"
url = 'http://www.lacada.com/2018/career-opportunities/'
organization_id= 31

def run(url):
    soup = get_javascript_soup(url)
    jobs_list = soup.select('div.wpb_wrapper > p > a')
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list:
        job_class.title = job_entry.text.strip()
        job_class.info_link = job_entry['href']
        insert_count+= job_insert(job_class)
    return insert_count    
