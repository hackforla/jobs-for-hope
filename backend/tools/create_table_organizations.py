#!/bin/python2.7
# python tools/quickstart.py
# cat organizations.sql | sqlite3 test.db
# sqlite3 test.db "select * from organizaitons"

import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of the spreadsheet.
SPREADSHEET_ID = '16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI'
RANGE_NAME = 'Organizations!A2:D'

CREATE_TABLE_ORGANIZATIONS = "CREATE TABLE IF NOT EXISTS organizations(id INTEGER PRIMARY KEY, name TEXT, url TEXT, region TEXT, logo TEXT);\n"
INSERT_ROW_ORGANIZATION = "INSERT INTO organizations ('name', 'url', 'region', 'logo') VALUES ('%s', '%s', '%s', '%s');\n"
OUTPUT_FILE = "organizations.sql"

def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
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

    if not values:
        print('No data found.')
    else:
        #print('Org, URL, Regions(s), Logo:')
        with open(OUTPUT_FILE, 'w') as f:
            f.write(CREATE_TABLE_ORGANIZATIONS)
            for row in values:
                # Print columns A and E, which correspond to indices 0 and 3.
                if len(row) == 4:
                    #print('%s, %s, %s, %s' % (row[0], row[1], row[2], row[3]))
                    f.write(INSERT_ROW_ORGANIZATION % (row[0].encode('utf8'), row[1].encode('utf8'), row[2].encode('utf8'), row[3].encode('utf8')))

if __name__ == '__main__':
    main()
