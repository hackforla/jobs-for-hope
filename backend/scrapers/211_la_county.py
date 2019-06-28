import globals
from globals import get_soup, job_insert
from job import Job
# 211 LA County

organization = "211 LA County"
url = 'https://www.211la.org/careers'
organization_id = 1


def run(url):
    soup = get_soup("https://www.211la.org/careers")
    jobs_list = soup.find_all("div", {"class": "jobBtn"})
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list:
        for child in job_entry.find_all("a"):
            job_class.title = child.text
            job_class.info_link = child.get('href')
        insert_count += job_insert(job_class)
    return insert_count
