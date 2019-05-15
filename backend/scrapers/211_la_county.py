import globals
from globals import get_soup, update_db

# 211 LA County

organization = "211 LA County"
url = 'https://www.211la.org/careers'


def run(url):
    soup = get_soup("https://www.211la.org/careers")
    jobs_list = soup.find_all("div", {"class": "jobBtn"})

    for job_entry in jobs_list:
        for child in job_entry.find_all("a"):
            globals.job_title = child.text
            globals.info_link = child.get('href')
        update_db(organization)
