import globals
from globals import get_soup, update_db

# LA Family Housing Corporation

organization = "LA Family Housing Corporation"
url = 'https://lafh.org/employment-at-lafh/'

def run(url):
    soup = get_soup(url)
    jobs_div = soup.find('div', {'class':'sqs-block-content'})
    jobs_list = jobs_div.find_all('p')

    for job_entry in jobs_list[4:len(jobs_list)-3]:
        globals.job_title = job_entry.a.text.strip()
        globals.info_link = 'https://lafh.org' + job_entry.a['href']
        update_db(organization)
