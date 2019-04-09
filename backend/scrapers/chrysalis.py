import globals
from globals import get_soup, update_db

# Chrysalis

organization = "Chrysalis"
url = 'http://changelives.applicantstack.com/x/openings'

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find('tbody')

    for job_entry in jobs_list.find_all('tr'):
        job_details = job_entry.find_all('td')
        globals.job_title = job_details[0].find('a').text
        globals.info_link = job_details[0].find('a')['href']
        globals.job_summary = globals.info_link
        globals.job_location = job_details[2].text
        update_db(organization)
