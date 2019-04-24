import globals
from globals import get_soup, update_db

# Ascencia

organization = "Ascencia"
url = 'https://www.ascenciaca.org/about/employment/'

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find('div', {'class': "siteorigin-widget-tinymce textwidget"}).find_all('a')

    for job_entry in jobs_list:
        globals.job_title = job_entry.text
        globals.info_link = job_entry['href']
        update_db(organization)
