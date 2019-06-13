import globals
from globals import clean_location, city_to_zip, get_soup, get_javascript_soup_delayed, job_insert
from job import Job
organization = 'Los Angeles Homeless Services Authority'
url = 'https://www.governmentjobs.com/careers/lahsa'
organization_id= 33


def run(url):
    next_page_url = url
    soup = get_javascript_soup_delayed(next_page_url, 'job-table-title')
    job_class= Job(organization, "")
    job_class.organization_id= organization_id
    insert_count= 0
    while soup:
        job_table = soup.find('tbody')
        for job_row in job_table.find_all('tr'):
            job_class.title = job_row.find(
                'td', {'class': 'job-table-title'}).a.text.strip()
            job_class.info_link = 'https://www.governmentjobs.com' + \
                job_row.find('td', {'class': 'job-table-title'}).a['href']
            job_class.salary = job_row.find(
                'td', {'class': 'job-table-salary'}).text
            job_class.full_or_part = job_row.find(
                'td', {'class': 'job-table-type'}).text
            # Get soup for job listing to get more info
            job_soup = get_soup(job_class.info_link)
            info_container = job_soup.find(
                'div', {'class': 'summary container'})
            job_class.location = clean_location(info_container.find(
                'div', {'id': 'location-label-id'}).parent.find_all('div')[2].text)
            job_class.zip_code = city_to_zip(job_class.location)
            job_class.summary = job_soup.find(
                'div', {'id': 'details-info'}).find('p').text
            insert_count+= job_insert(job_class)
        if not 'disabled' in soup.find(
                'li', {'class': 'PagedList-skipToNext'}).get("class"):
            next_page_url = 'https://www.governmentjobs.com/careers/lahsa?' + \
                soup.find('li', {'class': 'PagedList-skipToNext'}
                          ).a['href'].split('?')[1]
            soup = get_javascript_soup_delayed(
                next_page_url, 'job-table-title')
        else:
            soup = False
    return insert_count
