import globals
from globals import get_soup, job_insert
from job import Job
# Coalition for Responsible Community Development

organization = 'Coalition for Responsible Community Development'
url = 'http://www.coalitionrcd.org/get-involved/work-at-crcd/'
organization_id = 13


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all('div', {'class': 'et_pb_toggle'})
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list:
        job_class.title = job_entry.find('h5').text.strip()
        job_class.link = url
        insert_count += job_insert(job_class)
    return insert_count
