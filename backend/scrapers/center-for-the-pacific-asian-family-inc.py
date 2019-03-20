import globals
from globals import get_javascript_soup, update_db

# Center for the Pacific Asian Family, Inc.

organization = 'Center for the Pacific Asian Family, Inc.'
url = 'http://nurturingchange.org/get-involved/employment/'


def run(url):
    soup = get_javascript_soup(url)
    jobs_list = soup.select('div.entry-content div.small-12.columns > p > a')

    for job_entry in jobs_list:
        globals.job_title = job_entry.text
        globals.info_link = job_entry['href']
        update_db(organization)
