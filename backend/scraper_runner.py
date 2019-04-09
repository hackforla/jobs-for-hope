import sys
import traceback
import scraperloader
import sqlite3
import globals
from os.path import basename

# CONSTANTS

pdf_message = 'See PDF document.'

def connect_sqlite():
    # SQL CONNECTION
    globals.db = sqlite3.connect("jobs_for_hope.db")
    globals.c = globals.db.cursor()

    # Create SQL schema if necessary
    globals.create_table_jobs()

    globals.reset_vars()

    # set the active scraper if one is passed in
    if len(sys.argv) - 1 == 1:
        globals.active_scrapers = [basename(sys.argv[1])]

    # load and run scrapers
    for i in scraperloader.getScrapers():
        try:
            # filter to run only active scrapers
            if len(globals.active_scrapers) > 0 and not i['name'] in globals.active_scrapers:
                continue
            scraper = scraperloader.loadScraper(i)
            organization = scraper.organization
            print organization
            globals.delete_jobs_by_organization(organization)
            scraper.run(scraper.url)
        except Exception:
            traceback.print_exc()
            print 'Scraper failed:', organization

        globals.reset_vars()


    try:


if __name__ == '__main__':
    connect_sqlite()
