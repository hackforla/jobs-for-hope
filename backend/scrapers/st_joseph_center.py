import globals
from globals import get_soup, get_javascript_soup, job_insert, clean_location, city_to_zip, date_ago
from job import Job
# St. Joseph Center

organization = 'St. Joseph Center'
url = 'https://stjosephctr.org/careers/'
organization_id= 48

def run(url):
    soup = get_javascript_soup(url)
    jobs_list = soup.find(
        'table', {'class': 'srJobList'}).tbody.find_all('tr')[1:]
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    for job_entry in jobs_list:
        job_class.title = job_entry.find(
            'td', {'class': 'srJobListJobTitle'}).text.strip()
        onClickLink = job_entry['onclick']
        job_class.info_link = onClickLink[13:len(onClickLink) - 3]
        job_class.full_or_part = job_entry.find(
            'td', {'class': 'srJobListTypeOfEmployment'}).text
        job_class.location = job_entry.find(
            'td', {'class': 'srJobListLocation'}).text
        location_parts = job_class.location.split(',')
        if len(location_parts) > 1 and len(
                location_parts[-1]) and location_parts[-1].strip().lower() != 'ca':
            # skip job if state is not CA
            print('Skip location: %s' % job_class.location)
            continue
        job_class.zip_code = city_to_zip(location_parts[0])
        insert_count+= job_insert(job_class)
    return insert_count
