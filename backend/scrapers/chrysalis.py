import globals
from globals import get_soup, job_insert
from job import Job
# Chrysalis

organization = "Chrysalis"
url = 'http://changelives.applicantstack.com/x/openings'
organization_id= 11

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find('tbody')
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list.find_all('tr'):
        job_details = job_entry.find_all('td')
        job_class.title = job_details[0].find('a').text
        job_class.info_link = job_details[0].find('a')['href']
        job_class.location = job_details[2].text
        insert_count+= job_insert(job_class)
    return insert_count    
