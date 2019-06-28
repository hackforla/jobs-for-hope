import globals
from globals import get_soup, job_insert
from job import Job
import re

# JWCH Institute, Inc.

organization = "JWCH Institute, Inc."
url = "http://jwchinstitute.org/about-us/work-at-jwch/"
organization_id = 28


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find('ul', {'class': 'lcp_catlist'})
    job_class = Job(organization, "")
    job_class.organization_id = organization_id
    insert_count = 0
    for job_entry in jobs_list.find_all('li'):
        job_class.title = job_entry.a.text.strip()
        job_class.info_link = job_entry.a['href']
        job_soup = get_soup(job_class.info_link)
        summary_match = job_soup.find(text=re.compile("Position Purpose:"))
        if summary_match is not None:
            job_class.summary = summary_match.parent.parent.text
        else:
            raise globals.ParseError(job_class.info_link,
                                     'Cannot find job summary')
        insert_count += job_insert(job_class)
    return insert_count
