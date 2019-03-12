# vim: set fileencoding=utf8
#!/bin/python2.7
# python tools/quickstart.py
# cat organizations.sql | sqlite3 test.db
# sqlite3 test.db "select * from organizations"

import pickle
import os.path
import sqlite3
from sqlite3 import Error
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of the spreadsheet.
SPREADSHEET_ID = '16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI'
# columns A-D: Organization, URL, Regions, Logo
RANGE_NAME = 'Organizations!A2:D'

def error_handler(error_msg):
    print(error_msg)
    exit()

def create_connection(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return None

def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def create_region(conn, region):
    sql = ''' INSERT INTO regions (name)
              VALUES (?) '''
    try:
        curr = conn.cursor()
        curr.execute(sql, region)
    except sqlite3.IntegrityError:
        error_handler('SQL ERROR FOR QUERY: ' + query)

    return curr.lastrowid

def create_organization(conn, organization):
    sql = ''' INSERT INTO organizations (name, url, region_id, logo)
              VALUES (?, ?, ?, ?) '''
    try:
        c = conn.cursor()
        c.execute(sql, organization)
    except sqlite3.IntegrityError:
        error_handler('SQL ERROR FOR QUERY: ' + query)

    return c.lastrowid

def select_all_regions(conn):
    c = conn.cursor()
    c.execute("SELECT * from regions")

    rows = c.fetchall()

    for row in rows:
        print(row)

def select_region_id_by_name(conn, name):
    c = conn.cursor()
    c.execute("SELECT id from regions WHERE name=?", name)

    rows = c.fetchall()
    return rows[0]

def select_all_organizations(conn):
    c = conn.cursor()
    c.execute("SELECT * from organizations")

    rows = c.fetchall()

    for row in rows:
        print(row)

def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """

    sql_create_regions_table = """
    CREATE TABLE IF NOT EXISTS regions (
        id INTEGER PRIMARY KEY,
        name TEXT
    ) """
    sql_create_organizations_table = """
    CREATE TABLE IF NOT EXISTS organizations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        region_id INTEGER NOT NULL,
        logo TEXT,
        FOREIGN KEY (region_id) REFERENCES regions (id)
    ) """

    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                                range=RANGE_NAME).execute()
    values = result.get('values', [])
    database = "test.db"

    if not values:
        print('No data found.')
    else:
        conn = create_connection(database)
        if conn is None:
            print("Error! cannot create the database connection.")

        create_table(conn, sql_create_regions_table)
        create_table(conn, sql_create_organizations_table)

        # regions table
        regions = {}
        for row in values:
            # Print columns A and E, which correspond to indices 0 and 3.
            if row[2] is not None:
                service_regions = row[2].replace('\n', ',').split(',')
                for region in service_regions:
                    if len(region) > 0:
                        regions[region.lstrip()] = 1
        for key, value in regions.items():
            #print('%s %d' % (key, value))
            create_region(conn, [key])
        select_all_regions(conn)

        # organization table
        for row in values:
            if len(row) == 4:
                # get region_id from region name
                # TODO take the first region listed for now. This needs to be
                # reworked.
                region_name = row[2].replace('\n', ',').split(',')[0]
                region_id = select_region_id_by_name(conn, [region_name])
                create_organization(conn, [row[0], row[1], region_id[0], row[3]])

        select_all_organizations(conn)
        conn.commit()
        conn.close()
if __name__ == '__main__':
    main()
