import globals
from globals import get_soup, job_insert
from job import Job
# Ascencia

organization = "Ascencia"
url = 'https://www.ascenciaca.org/about/employment/'
organization_id = 6


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find('div', {
        'class': "siteorigin-widget-tinymce textwidget"
    }).find_all('a')
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list:
        job_class.title = job_entry.text
        job_class.info_link = job_entry['href']
        insert_count += job_insert(job_class)
    return insert_count
