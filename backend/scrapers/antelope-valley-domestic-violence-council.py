import globals
from globals import get_soup, update_db

# Antelope Valley Domestic Violence Council (Valley Oasis)

organization = "Antelope Valley Domestic Violence Council (Valley Oasis)"
url = 'http://www.valleyoasis.org/job-opportunities.html'

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find("div",{"itemtype": "http://schema.org/WebPage"}).find_all('a')


    for job_entry in jobs_list:
        temp_link = job_entry['href']
        globals.job_title = job_entry.text

        if (job_entry['href'][0:4] == 'http'):
            globals.info_link = temp_link
        else:
            globals.info_link = 'http://www.valleyoasis.org' + temp_link

        update_db(organization)
