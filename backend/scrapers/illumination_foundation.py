import globals
from globals import get_soup, update_db, clean_location, city_to_zip, date_ago

# Illumination Foundation

organization = "Illumination Foundation"
url = 'https://www.ifhomeless.org/careers/'


def run(url):
    soup = get_soup(url)

    jobs_list = soup.find_all('div', {'class': 'list-data'})

    for job_entry in jobs_list:
        globals.job_info = job_entry.find('div', {'class': 'job-info'})
        globals.job_title = globals.job_info.find(
            'span', {'class': 'job-title'}).text.strip()
        globals.info_link = globals.job_info.h4.a['href']
        globals.full_or_part = job_entry.find(
            'div', {'class': 'job-type'}).text.strip()
        globals.job_location = clean_location(job_entry.find(
            'div', {'class': 'job-location'}).text.strip())
        globals.job_zip_code = city_to_zip(globals.job_location)
        relative_date = job_entry.find(
            'div', {'class': 'job-date'}).text.strip().split(' ')
        globals.job_post_date = date_ago(
            int(relative_date[1]), relative_date[2])
        globals.job_summary = job_entry.find(
            'div', {'class': 'job-description'}).p.text.strip()
        update_db(organization)
