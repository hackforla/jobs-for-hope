import sys
import traceback
import scraperloader
import sqlite3
import psycopg2
import globals
from os.path import basename
from config import config

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


def connect_pg():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        globals.cur = conn.cursor()

        # execute a statement
        print('PostgreSQL database version:')
        globals.cur.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = globals.cur.fetchone()
        print(db_version)

        # close the communication with the PostgreSQL
        globals.cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

if __name__ == '__main__':
    connect_pg()
