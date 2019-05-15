import globals
from globals import get_soup, update_db

# LA Family Housing Corporation

organization = "LA Family Housing Corporation"
url = 'https://lafh.org/employment-at-lafh/'


def run(url):
    soup = get_soup(url)
    jobs_div = soup.find('div', {'class': 'sqs-block-content'})
    jobs_list = jobs_div.find_all('p')

    for job_entry in jobs_list[4:len(jobs_list) - 3]:
        # some job line have multiple job links but only one contains anchor
        # text
        job_links = job_entry.find_all('a')
        for job_link in job_links:
            if len(job_link.text.strip()):
                globals.job_title = job_link.text.strip()
                globals.info_link = 'https://lafh.org' + job_link['href']
                update_db(organization)
