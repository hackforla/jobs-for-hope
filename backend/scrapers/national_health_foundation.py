import globals
from globals import get_soup, job_insert
from job import Job
# National Health Foundation
organization = "National Health Foundation"
url = 'http://nationalhealthfoundation.org/careers/'
organization_id= 36

def run(url):

    soup = get_soup(url)

    job_listings = soup.find(
        'div', {'class': 'tf-sh-78847e2ef97967b68fdec32a2997ab8f'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_item in job_listings.find_all('a'):
        job_class.title = job_item.text.strip()
        job_class.info_link = job_item['href']
        insert_count+= job_insert(job_class)
    return insert_count
