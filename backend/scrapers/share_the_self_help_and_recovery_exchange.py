import globals
from globals import get_soup, job_insert
from job import Job
# SHARE! the Self Help And Recovery Exchange
organization = "SHARE! the Self Help And Recovery Exchange"
url = "https://shareselfhelp.org/programs-share-the-self-help-and-recovery-exchange/share-jobs-share-self-help-recovery-exchange/"
organization_id = 44


def run(url):
    soup = get_soup(url)
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for html_element in soup.find_all('h4'):
        job_class.title = html_element.a.text
        job_class.info_link = html_element.a['href']
        job_class.location = html_element.span.text.split(']')[1]
        insert_count += job_insert(job_class)
    return insert_count