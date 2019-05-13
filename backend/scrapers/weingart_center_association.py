import globals
from globals import get_soup, update_db

# Weingart Center Association

organization = "Weingart Center Association"
url = 'http://weingart.org/index.php/get-involved'


def run(url):
    soup = get_soup(url)

    jobs_container = soup.find(text='Current Openings:').parent.parent.parent

    for job_listing in jobs_container.find_all('a'):
        globals.job_title = job_listing.text
        globals.info_link = job_listing['href']
        update_db(organization)
