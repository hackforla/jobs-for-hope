import globals 
from globals import get_soup, update_db

# SHARE! the Self Help And Recovery Exchange
organization = "SHARE! the Self Help And Recovery Exchange"
url= "https://shareselfhelp.org/programs-share-the-self-help-and-recovery-exchange/share-jobs-share-self-help-recovery-exchange/"

def run(url):
    soup = get_soup(url)

    for html_element in soup.find_all('h4'):
        globals.job_title = html_element.a.text
        globals.info_link = html_element.a['href']
        globals.job_location = html_element.span.text.split(']')[1]
        update_db(organization)

