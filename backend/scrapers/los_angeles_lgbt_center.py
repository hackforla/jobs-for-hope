import globals
from globals import get_javascript_soup, job_insert
from job import Job
# Los Angeles LGBT Center

organization = "Los Angeles LGBT Center"
url = 'https://lalgbtcenter.org/about-the-center/careers'
organization_id= 32

def run(url):
    soup = get_javascript_soup(url)

    job_divs = soup.find_all('div', {'class': 'ui-accordion-content'})
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_div in job_divs:
        for job_listing in job_div.find_all('li'):
            job_class.title = job_listing.text.strip()
            job_class.info_link = 'https://lalgbtcenter.org' + \
                job_listing.find_all('a')[-1]['href']
            insert_count+= job_insert(job_class)

    job_lists = soup.find_all('ul', {'class': 'ui-accordion-content'})

    for job_list in job_lists:
        for job_listing in job_list.find_all('li'):
            job_class.title = job_listing.text.strip()
            job_class.info_link = 'https://lalgbtcenter.org' + \
                job_listing.find_all('a')[-1]['href']
            insert_count+= job_insert(job_class)
    return insert_count
