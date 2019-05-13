import globals 
from globals import get_javascript_soup, update_db
# Skid Row Housing Trust

organization = "Skid Row Housing Trust"
url= 'https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=37F34A94DC3DBD8AA2C5ACCA82E66F1E&jpt=#'

def run(url):
    soup = get_javascript_soup(url)

    job_listings = soup.find_all('div', {'class':'jobInfo'})

    for job_listing in job_listings:
        globals.job_title = job_listing.find('span', {'class':'jobTitle'}).a.text.strip()
        globals.info_link = 'https://www.paycomonline.net' + job_listing.find('span',{'class':'jobTitle'}).a['href']
        if job_listing.find('span', {'class':'jobLocation'}).text:
            globals.job_location = globals.clean_location(job_listing.find('span', {'class':'jobLocation'}).text.split(' - ')[1])
            globals.job_zip_code = globals.city_to_zip(globals.job_location)
        if job_listing.find('span', {'class':'jobDescription'}).text:
            globals.job_summary = job_listing.find('span', {'class':'jobDescription'}).text.strip()
        if job_listing.find('span', {'class':'jobType'}).text:
            if  ('ft' in str(job_listing.find('span', {'class':'jobType'}).text).lower()) or ('full' in str(job_listing.find('span', {'class':'jobType'}).text).lower()):
                globals.full_or_part = 'full'
            else:
                globals.full_or_part = 'part'
        update_db(organization)
  