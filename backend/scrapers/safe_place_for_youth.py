import globals
from globals import get_soup, job_insert
from job import Job
# Safe Place for Youth

organization = "Safe Place for Youth"
url = "http://www.safeplaceforyouth.org/employment_opportunities"
organization_id= 42

def run(url):
    soup = get_soup(url)
    jobs_div = soup.find('div', {'id': 'yui_3_16_0_ym19_1_1492463820306_5454'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_listing in jobs_div.find_all('p'):
        listing_element = job_listing.find_all('a')
        if len(listing_element) > 0:
            job_class.title = listing_element[0].text
            job_class.info_link = listing_element[0]['href']
            insert_count+= job_insert(job_class)
    return insert_count
