import globals
from globals import get_soup, job_insert
from job import Job
# Neighborhood Legal Services of Los Angeles County
organization = "Neighborhood Legal Services of Los Angeles County"
url = 'http://www.nlsla.org/current-employment-opportunities/'
organization_id= 37

def run(url):
    soup = get_soup(url)

    job_listings = soup.find('article').find_all('a')
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_item in job_listings:
        if len(job_item.text.strip()):
            job_class.title = job_item.text.strip()
            job_class.info_link = url + job_item['href']
            insert_count+= job_insert(job_class)
    return insert_count
