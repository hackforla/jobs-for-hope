import globals
from globals import get_soup, job_insert
from job import Job
# LA Family Housing Corporation

organization = "LA Family Housing Corporation"
url = 'https://lafh.org/employment-at-lafh/'
organization_id= 29

def run(url):
    soup = get_soup(url)
    jobs_div = soup.find('div', {'class': 'sqs-block-content'})
    jobs_list = jobs_div.find_all('p')
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list[4:len(jobs_list) - 3]:
        # some job line have multiple job links but only one contains anchor
        # text
        job_links = job_entry.find_all('a')
        for job_link in job_links:
            if len(job_link.text.strip()):
                job_class.title = job_link.text.strip()
                job_class.info_link = 'https://lafh.org' + job_link['href']
                insert_count+= job_insert(job_class)
    return insert_count