import sys
import traceback
import scraperloader
import psycopg2
import globals
from os.path import basename
from config import config
from globals import conn, cur

# CONSTANTS

pdf_message = 'See PDF document.'


def connect():
    """ Connect to the PostgreSQL database server """
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        globals.conn = psycopg2.connect(**params)
        globals.conn.autocommit = True

        # create a cursor
        globals.cur = globals.conn.cursor()

        #globals.drop_tables()
        # create schema
        globals.create_tables()

        # set the active scraper if one is passed in
        if len(sys.argv) - 1 == 1:
            globals.active_scrapers = [basename(sys.argv[1])]

        # load and run scrapers
        total_jobs = 0
        scrapers = scraperloader.getScrapers()
        for idx, i in enumerate(scrapers):
            try:
                # filter to run only active scrapers
                if len(globals.active_scrapers
                       ) > 0 and not i['name'] in globals.active_scrapers:
                    continue
                scraper = scraperloader.loadScraper(i)
                organization_name = scraper.organization
                globals.print_organization(organization_name, idx + 1,
                                           len(scrapers))
                globals.delete_jobs_by_organization(organization_name)
                insert_count = scraper.run(scraper.url)
                total_jobs += insert_count
                globals.print_organization_end(insert_count)
            except Exception:
                traceback.print_exc()
                print 'Scraper failed:', scraper.organization
            finally:
                sys.stdout.flush()

        # close the communication with the PostgreSQL
        globals.cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if globals.conn is not None:
            globals.conn.close()
            print('Database connection closed.')
            print(total_jobs)


if __name__ == '__main__':
    connect()
