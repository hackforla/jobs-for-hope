import globals 
from globals import get_javascript_soup, update_db

# The People Concern (Formerly OPCC & LAMP)

organization = "The People Concern"
url= 'https://theapplicantmanager.com/careers?co=lc'

def run(url):
    soup = get_javascript_soup(url)

    jobs_table = soup.find('table',{'id':'careers_table'}).tbody.find_all('tr')

    for job_row in jobs_table:
        job_entry = job_row.find_all('td')
        globals.job_title = job_entry[0].a.text
        globals.info_link = 'https://theapplicantmanager.com/' + job_entry[0].a['href']
        globals.job_location = job_entry[1].text
        globals.full_or_part = job_entry[3].text
        globals.job_post_date = job_entry[4].text
        update_db(organization)
