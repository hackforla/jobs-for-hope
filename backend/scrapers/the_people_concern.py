import globals
from globals import get_javascript_soup, job_insert
from job import Job
# The People Concern (Formerly OPCC & LAMP)

organization = "The People Concern"
url = 'https://theapplicantmanager.com/careers?co=lc'
organization_id = 53


def run(url):
    soup = get_javascript_soup(url)

    jobs_table = soup.find('table', {
        'id': 'careers_table'
    }).tbody.find_all('tr')
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_row in jobs_table:
        job_entry = job_row.find_all('td')
        job_class.title = job_entry[0].a.text
        job_class.info_link = 'https://theapplicantmanager.com/' + \
            job_entry[0].a['href']
        job_class.location = job_entry[1].text
        job_class.full_or_part = job_entry[3].text
        job_class.post_date = job_entry[4].text
        insert_count += job_insert(job_class)
    return insert_count
