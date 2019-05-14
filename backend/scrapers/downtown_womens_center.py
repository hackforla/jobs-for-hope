import globals
from globals import get_soup, update_db

# Downtown Women's Center

organization = "Downtown Women's Center"
url = 'https://www.downtownwomenscenter.org/career-opportunities/'


def run(url):
    soup = get_soup(url)
    job_lists = soup.find('div', {'class': 'post'}).find_all('ul')[:-1]

    for index, job_list in enumerate(job_lists):
        for job_entry in job_list.find_all('li'):
            if index == 0:
                globals.full_or_part = 'Full-Time'
            elif index == 1:
                globals.full_or_part = 'Part-Time'
            else:
                globals.full_or_part = 'On-Call'
            globals.job_title = job_entry.a.text
            globals.info_link = job_entry.a['href']
            job_soup = get_soup(globals.info_link)
            job_details = job_soup.find('div', {'aria-label': 'Job Details'})
            if job_details:
                globals.job_location = job_details.find(
                    'span', {'aria-label': 'Job Location'}).text
                globals.salary = job_details.find(
                    'span', {'aria-label': 'Salary Range'}).text
            update_db(organization)
