import traceback
import scraperloader
import sqlite3
import globals

# CONSTANTS

pdf_message = 'See PDF document.'

# GLOBALS

scrapers = []

# SQL CONNECTION

globals.db = sqlite3.connect("jobs_for_hope.db")
globals.c = globals.db.cursor()

# Clear and recreate SQL schema
globals.drop_table_jobs()
globals.create_table_jobs()

globals.reset_vars()

# load and run scrapers
for i in scraperloader.getScrapers():
    try:
        scraper = scraperloader.loadScraper(i)
        organization = scraper.organization
        print(organization)
        scraper.run(scraper.url)
    except Exception:
        traceback.print_exc()
        print('scraper failed', organization)

    globals.reset_vars()
