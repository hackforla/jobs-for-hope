import globals
from globals import get_javascript_soup_delayed, update_db

# City of Pomona

organization = "City of Pomona"
url = 'http://agency.governmentjobs.com/pomona/default.cfm'

def run(url):
    soup = get_javascript_soup_delayed(url, 'jobtitle')
    jobs_table = soup.find('table', {'class': 'table'})
    jobs_list = jobs_table.find('tbody').find_all('tr')

    for job_entry in jobs_list:
        job_details = job_entry.find_all('td')
        globals.job_title = job_details[0].find('a').text.strip()
        globals.info_link = 'http://agency.governmentjobs.com/pomona/' + job_details[0].find('a')['href']
        globals.full_or_part = job_details[1].text.strip()
        globals.salary = job_details[2].text.strip()
        globals.job_location = 'Pomona'
        update_db(organization)
