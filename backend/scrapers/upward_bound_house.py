import globals
from globals import get_soup, job_insert
from job import Job
# Upward Bound House
organization = "Upward Bound House"
url = 'https://upwardboundhouse.org/about-us/careers/'
organization_id= 60

def run(url):
    soup = get_soup(url)
    jobs_div = soup.find('h1', text='Careers').parent
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_listing in jobs_div.find_all('a'):
        job_class.title = job_listing.text
        job_class.info_link = job_listing['href']
        insert_count+= job_insert(job_class)
    return insert_count
