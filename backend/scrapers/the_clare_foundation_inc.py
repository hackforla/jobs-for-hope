import globals
from globals import get_javascript_soup_delayed, job_insert
from job import Job

# The Clare Foundation, Inc.
organization = "Clare Foundation, Inc."
url = 'http://clarefoundation.org/careers/'
organization_id = 52


def run(url):
    soup = get_javascript_soup_delayed(url, 'div#content')

    listings_container = soup.find('div', {'id': 'content'})
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for listing in listings_container.find_all('p'):
        job_class.title = listing.text
        job_class.info_link = listing.a['href']
        insert_count += job_insert(job_class)
    return insert_count
