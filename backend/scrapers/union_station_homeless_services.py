import globals
from globals import get_soup, job_insert
from datetime import datetime
from datecleaner import month_to_num
from job import Job
# Union Station Homeless Services

organization = "Union Station Homeless Services"
url = 'https://unionstationhs.org/about/employment/'
organization_id = 57


def run(url):
    soup = get_soup(url)

    jobs_container = soup.find('dl', {'class': 'employment-opportunities'})
    job_class = Job(organization, "")
    job_class.info_link = url
    job_class.organization_id = organization_id
    insert_count = 0
    for job_listing in jobs_container.find_all('dt'):
        job_heading = job_listing.h3.text.split(' Posted ')
        job_class.title = job_heading[0]
        job_class.summary = job_listing.p.text
        date = job_heading[1].split(' ')
        month = month_to_num(date[0])
        day = int(date[1][0:len(date[1]) - 1])
        year = int(date[2])
        job_class.post_date = datetime(year, month, day)
        insert_count += job_insert(job_class)
    return insert_count
