import globals
from globals import get_soup, update_db
from datetime import datetime
from datecleaner import month_to_num

# Union Station Homeless Services

organization = "Union Station Homeless Services"
url = 'https://unionstationhs.org/about/employment/'


def run(url):
    soup = get_soup(url)

    jobs_container = soup.find('dl', {'class': 'employment-opportunities'})
    globals.info_link = url

    for job_listing in jobs_container.find_all('dt'):
        job_heading = job_listing.h3.text.split(' Posted ')
        globals.job_title = job_heading[0]
        globals.job_summary = job_listing.p.text
        date = job_heading[1].split(' ')
        month = month_to_num(date[0])
        day = int(date[1][0:len(date[1]) - 1])
        year = int(date[2])
        globals.job_post_date = datetime(year, month, day)
        update_db(organization)
