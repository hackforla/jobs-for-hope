import globals
from globals import get_soup, job_insert
from job import Job
# Downtown Women's Center

organization = "Downtown Women's Center"
url = 'https://www.downtownwomenscenter.org/career-opportunities/'
organization_id = 17


def run(url):
    soup = get_soup(url)
    job_lists = soup.find('div', {'class': 'post'}).find_all('ul')[:-1]
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for index, job_list in enumerate(job_lists):
        for job_entry in job_list.find_all('li'):
            if index == 0:
                job_class.full_or_part = 'Full-Time'
            elif index == 1:
                job_class.full_or_part = 'Part-Time'
            else:
                job_class.full_or_part = 'On-Call'
            job_class.title = job_entry.a.text
            job_class.info_link = job_entry.a['href']
            job_soup = get_soup(job_class.info_link)
            job_details = job_soup.find('div', {'aria-label': 'Job Details'})
            if job_details:
                job_class.location = job_details.find(
                    'span', {
                        'aria-label': 'Job Location'
                    }).text
                job_class.salary = job_details.find(
                    'span', {
                        'aria-label': 'Salary Range'
                    }).text
            insert_count += job_insert(job_class)
    return insert_count
