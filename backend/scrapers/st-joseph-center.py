import globals
from globals import get_soup, get_javascript_soup, update_db, reset_vars, clean_location, city_to_zip, date_ago

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
        globals.job_location = job_entry.find('td',{'class':'srJobListLocation'}).text
        location_parts = globals.job_location.split(',')
        if len(location_parts) > 1 and len(location_parts[-1]) and location_parts[-1].strip().lower() != 'ca':
            # skip job if state is not CA
            print('Skip location: %s' % globals.job_location)
            reset_vars()
            continue
        globals.job_zip_code = city_to_zip(location_parts[0])
        update_db(organization)
