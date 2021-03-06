#!/bin/python2.7
# python tools/quickstart.py
# cat regions.sql | sqlite3 test.db
# sqlite3 test.db "select * from regions"

import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of the spreadsheet.
SPREADSHEET_ID = '16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI'
RANGE_NAME = 'Organizations!C2:C'

CREATE_TABLE_REGIONS = "CREATE TABLE IF NOT EXISTS regions(id INTEGER PRIMARY KEY, name TEXT);\n"
INSERT_ROW_REGION = "INSERT INTO regions ('name') VALUES ('%s');\n"
OUTPUT_FILE = "regions.sql"

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
            f.write(CREATE_TABLE_REGIONS)
            regions = {}
            for row in values:
                # Print columns A and E, which correspond to indices 0 and 3.
                if len(row) == 1:
                    #print('%s' % (row[0]))
                    #print('%s' % (row[0].replace('\n', ',').split(',')))
                    service_regions = row[0].replace('\n', ',').split(',')
                    for region in service_regions:
                        if len(region) > 0:
                            regions[region.lstrip()] = 1
            for key, value in regions.items():
                print('%s %d' % (key, value))
                f.write(INSERT_ROW_REGION % (key))

if __name__ == '__main__':
    main()
