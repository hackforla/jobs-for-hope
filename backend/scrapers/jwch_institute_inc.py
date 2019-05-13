import globals
from globals import get_soup, update_db
import re

# JWCH Institute, Inc.

organization = "JWCH Institute, Inc."
url = "http://jwchinstitute.org/about-us/work-at-jwch/"


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find('ul', {'class': 'lcp_catlist'})

    for job_entry in jobs_list.find_all('li'):
        globals.job_title = job_entry.a.text.strip()
        globals.info_link = job_entry.a['href']
        job_soup = get_soup(globals.info_link)
        summary_match = job_soup.find(text=re.compile("Position Purpose:"))
        if summary_match is not None:
            globals.job_summary = summary_match.parent.parent.text
        else:
            raise globals.ParseError(
                globals.info_link, 'Cannot find job summary')
        update_db(organization)
