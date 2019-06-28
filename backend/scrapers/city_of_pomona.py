import globals
from globals import get_javascript_soup_delayed, job_insert
from job import Job
# City of Pomona

organization = "City of Pomona"
url = 'http://agency.governmentjobs.com/pomona/default.cfm'
organization_id = 12


def run(url):
    soup = get_javascript_soup_delayed(url, 'jobtitle')
    jobs_table = soup.find('table', {'class': 'table'})
    jobs_list = jobs_table.find('tbody').find_all('tr')
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list:
        job_details = job_entry.find_all('td')
        job_class.title = job_details[0].find('a').text.strip()
        job_class.info_link = 'http://agency.governmentjobs.com/pomona/' + \
            job_details[0].find('a')['href']
        job_class.full_or_part = job_details[1].text.strip()
        job_class.salary = job_details[2].text.strip()
        job_class.location = 'Pomona'
        insert_count += job_insert(job_class)
    return insert_count
