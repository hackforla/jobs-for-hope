import globals
from globals import get_soup, update_db, clean_location, city_to_zip

# People Assisting the Homeless (PATH)

organization = "People Assisting the Homeless"
url = 'https://path.catsone.com/careers'

def run(url):
    soup = get_soup(url)

    jobs_list= soup.find('div',{'class':'JobGrid-etzr7g-4'})

    for job_entry in jobs_list.find_all('a'):
        globals.info_link = 'https://path.catsone.com' + job_entry['href']
        job_row = job_entry.find('div',{'class':'row'})
        job_divs = job_row.find_all('div')
        globals.job_title = job_divs[0].text.strip()
        globals.job_location = clean_location(job_divs[2].text.strip())
        globals.job_zip_code = city_to_zip(globals.job_location)
        update_db(organization)
        # Possible to get more info by scraping each job link, but the listings are extremely poorly written/standardized; scraper below works for most of the listings, but a few poorly written listings break the scraper
        # job_soup = get_soup(info_link)
        # job_description = job_soup.find('div',{'class':'Job__StyledDescription-s1h17u0t-0'})
        # if '\n' in job_description.find_all('strong')[0].text:
        #     full_or_part = job_description.find_all('strong')[0].text.split('\n')[1].strip()
        #     salary = job_description.find_all('strong')[0].text.split('\n')[2].strip().split(': ')[1]
        # else:
        #     full_or_part = job_description.find_all('strong')[1].text.strip()
        #     salary = job_description.find_all('strong')[2].text.split('\n')[0].split(':')[1].strip()
