import globals
from globals import get_javascript_soup, update_db

# Los Angeles Centers For Alcohol and Drug Abuse

organization = "Los Angeles Centers For Alcohol and Drug Abuse"
url = 'http://www.lacada.com/2018/career-opportunities/'


def run(url):
    soup = get_javascript_soup(url)
    jobs_list = soup.select('div.wpb_wrapper > p > a')
    for job_entry in jobs_list:
        globals.job_title = job_entry.text.strip()
        globals.info_link = job_entry['href']
        update_db(organization)
