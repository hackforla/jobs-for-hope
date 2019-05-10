import globals 
from globals import get_javascript_soup, update_db

# Shields For Families, Inc.
organization = "Shields For Families, Inc."
url= 'https://recruiting.paylocity.com/recruiting/jobs/List/1853/Shields-For-Families'

def run(url):
   
    soup = get_javascript_soup(url)

    job_listings = soup.find_all('div',{'class':'job-listing-job-item'})

    for job_listing in job_listings:
        globals.job_title = job_listing.find('span', {'class':'job-item-title'}).a.text.strip()
        globals.info_link = 'https://recruiting.paylocity.com' + job_listing.find('span', {'class':'job-item-title'}).a['href']
        if job_listing.find('div',{'class':'location-column'}).text:
            globals.job_location = job_listing.find('div',{'class':'location-column'}).text
            globals.job_zip_code = globals.city_to_zip(globals.job_location)
        globals.job_post_date = globals.string_to_date(job_listing.find('div',{'class':'job-title-column'}).find_all('span')[1].text.split(' - ')[0])
        update_db(organization)
