import globals
from globals import clean_location, city_to_zip, get_soup, update_db, reset_vars
from datecleaner import string_to_date

# Penny Lane Centers

organization = "Penny Lane Centers"
url = 'https://pennylanecenters.jobs.net/search'

def run(url):
    globals.job_post_date = ''
    soup = get_soup(url)
    jobs_table = soup.find('table',{'id':'job-result-table'})

    for job_row in jobs_table.find_all('tr',{'class':'job-result'}):
        job_title_cell = job_row.find('td',{'class':'job-result-title-cell'})
        globals.job_title = job_title_cell.a.text.strip()
        globals.info_link = 'https://pennylanecenters.jobs.net' + job_title_cell.a['href']
        globals.job_summary = globals.info_link
        globals.job_location = clean_location(job_row.find('div',{'class':'job-location-line'}).text)
        globals.job_zip_code = city_to_zip(globals.job_location)
        # Get Job Soup
        job_soup = get_soup(globals.info_link)
        globals.full_or_part = job_soup.find('li',{'class':'job-employee-type'}).find('div',{'class':'secondary-text-color'}).text
        globals.job_post_date = string_to_date(job_soup.find('li',{'class':'job-date-posted'}).find('div',{'class':'secondary-text-color'}).text)
        update_db(organization)
        reset_vars()
