import globals
from globals import get_soup, get_javascript_soup, update_db, clean_location, city_to_zip, date_ago

# St. Joseph Center

organization = 'St. Joseph Center'
url = 'https://stjosephctr.org/careers/'

def run(url):
    soup = get_javascript_soup(url)
    jobs_list = soup.find('table',{'class':'srJobList'}).tbody.find_all('tr')[1:]

    for job_entry in jobs_list:
        globals.job_title = job_entry.find('td',{'class':'srJobListJobTitle'}).text.strip()
        onClickLink = job_entry['onclick']
        globals.info_link = onClickLink[13:len(onClickLink)-3]
        globals.full_or_part = job_entry.find('td',{'class':'srJobListTypeOfEmployment'}).text
        globals.job_location = clean_location(job_entry.find('td',{'class':'srJobListLocation'}).text)
        globals.job_zip_code = city_to_zip(globals.job_location)
        update_db(organization)
