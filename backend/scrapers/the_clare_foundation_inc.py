import globals
from globals import get_soup, job_insert
from job import Job
# The Clare Foundation, Inc.
organization = "Clare Foundation, Inc."
url = 'http://clarefoundation.org/careers/'
organization_id = 52


def run(url):
    soup = get_soup(url)

    listings_container = soup.find('ul', {'class': 'display-posts-listing'})
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for listing in listings_container.find_all('li'):
        job_class.title = listing.text
        job_class.info_link = listing.a['href']
        insert_count += job_insert(job_class)
    return insert_count
