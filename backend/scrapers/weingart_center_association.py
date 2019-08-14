import globals
from globals import get_soup, job_insert
from job import Job
# Weingart Center Association

organization = "Weingart Center Association"
url = 'http://weingart.org/index.php/get-involved'
organization_id= 62

def run(url):
    soup = get_soup(url)

    openings = soup.find(text='Current Openings:')
    if openings is None:
        return 0
    jobs_container = openings.parent.parent.parent
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_listing in jobs_container.find_all('a'):
        job_class.title = job_listing.text
        job_class.info_link = job_listing['href']
        insert_count+= job_insert(job_class)
    return insert_count
