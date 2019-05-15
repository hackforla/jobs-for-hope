from datetime import datetime
import globals
from globals import get_javascript_soup, update_db

# The Whole Child

organization = "The Whole Child"
url = 'https://www.thewholechild.org/about/careers-internships/'


def run(url):
    soup = get_javascript_soup(url)

    jobs_list = soup.find('h3', text='Job Opportunities').next_sibling

    for job_entry in jobs_list.find_all('li'):
        globals.job_title = job_entry.text
        globals.info_link = job_entry.a['href']
        update_db(organization)
