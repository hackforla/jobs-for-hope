import globals 
from globals import get_soup, update_db
from datetime import datetime
from datecleaner import month_to_num

# The Village Family Services

organization = "The Village Family Services"
url= 'http://new.thevillagefs.org/jobs/type/default/'

def run(url):
    soup = get_soup(url)

    job_grid = soup.find('div',{'class':'wpjb-job-list'})

    for job_div in job_grid.find_all('div',{'class':'wpjb-col-main'}):
        major_line = job_div.find('div',{'class':'wpjb-line-major'})
        globals.job_title = major_line.a.text
        globals.info_link = major_line.a['href']
        globals.full_or_part = major_line.find('span',{'class':'wpjb-sub-title'}).text.strip()
        minor_line = job_div.find('div',{'class':'wpjb-line-minor'})
        globals.job_location = minor_line.find('span',{'class':'wpjb-job_location'}).text.strip()
        date = minor_line.find('span',{'class':'wpjb-job_created_at'}).text.strip().split(', ')
        month = month_to_num(date[0])
        day = int(date[1])
        if month <= datetime.now().month:
            year = datetime.now().year
        else:
            year = datetime.now().year-1
        globals.job_post_date = datetime(year, month, day)
        update_db(organization)
