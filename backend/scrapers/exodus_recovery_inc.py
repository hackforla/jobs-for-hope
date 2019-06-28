# vim: set fileencoding=utf8
# Editor configs above to save file in Unicode since this file contains
# non-ASCII characters
import globals
from globals import get_javascript_soup, job_insert
from job import Job
# Exodus Recovery, Inc.

organization = "Exodus Recovery, Inc."
url = 'https://www.exodusrecovery.com/employment/'
organization_id = 19


def run(url):
    soup = get_javascript_soup(url)
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    scraping = True
    while scraping:
        jobs_list = soup.find_all('article', {'class': 'et_pb_post'})
        for job_entry in jobs_list:
            job_title = job_entry.find('h2', {'class': 'entry-title'})
            job_class.title = job_title.text
            job_class.info_link = job_title.a['href']
            job_class.summary = job_entry.find('div', {
                'class': 'post-content'
            }).p.text
            insert_count += job_insert(job_class)
        # Check if more job entries on website to scrape
        if soup.find(text="« Older Entries"):
            soup = get_javascript_soup(
                soup.find(text="« Older Entries").parent['href'])
        else:
            scraping = False
    return insert_count
