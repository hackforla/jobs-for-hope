import globals
from globals import get_soup, update_db

# Coalition for Responsible Community Development

organization = 'Coalition for Responsible Community Development'
url = 'http://www.coalitionrcd.org/get-involved/work-at-crcd/'


def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all('div', {'class': 'et_pb_toggle'})

    for job_entry in jobs_list:
        globals.job_title = job_entry.find('h5').text.strip()
        globals.job_link = url
        update_db(organization)
