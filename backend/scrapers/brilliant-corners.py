import globals
from globals import get_soup, update_db

# Brilliant Corners

organization = "Brilliant Corners"
url = 'https://careers.jobscore.com/careers/brilliantcorners'

def run(url):
    soup = get_soup(url)
    jobs_list = soup.find_all("div",{"class":"js-job-container"})

    for job_entry in jobs_list:
        globals.job_title = job_entry.find("span",{"class","js-job-title"}).a.text
        globals.info_link = 'https://careers.jobscore.com' + job_entry.find("span",{"class","js-job-title"}).a['href']
        globals.job_location = job_entry.find("span",{"class","js-job-location"}).text.strip()

        job_soup = get_soup(globals.info_link)
        globals.full_or_part = job_soup.find("h2", {"class":"js-subtitle"}).text.split(' | ')[2]
        update_db(organization)
