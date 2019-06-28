from datetime import date, datetime
import re


def month_to_num(string):
    m = {
        'jan': 1,
        '1': 1,
        '01': 1,
        'feb': 2,
        '2': 2,
        '02': 2,
        'mar': 3,
        '3': 3,
        '03': 3,
        'apr': 4,
        '4': 4,
        '04': 4,
        'may': 5,
        '5': 5,
        '05': 5,
        'jun': 6,
        '6': 6,
        '06': 6,
        'jul': 7,
        '7': 7,
        '07': 7,
        'aug': 8,
        '8': 8,
        '08': 8,
        'sep': 9,
        '9': 9,
        '09': 9,
        'oct': 10,
        '10': 10,
        'nov': 11,
        '11': 11,
        'dec': 12,
        '12': 12
    }
    s = string.strip()[:3].lower()
    try:
        out = m[s]
        return out
    except:
        raise ValueError('Not a month')


def string_to_date(dateString, ordering=['month', 'day', 'year']):
    if len(ordering) != 3:
        print(
            'Error: convertStringToDate method has an optional second argument that requires an array with exactly 3 elements (year, month, day)'
        )
        return
    # Convert ordering to lowercase
    for i in range(len(ordering)):
        ordering[i] = ordering[i].lower()
    # Check if ordering args contains 'month', 'day', and 'year'
    if ('year' not in ordering) | ('month' not in ordering) | (
            'day' not in ordering):
        print(
            'Error: Ordering array must include year, month, and day among 3 args'
        )
        return
    # Check if ordering args are exactly 'month', 'day', and 'year'
    for ele in ordering:
        if ele not in ['year', 'month', 'day']:
            print(
                'Error: One of the args in ordering is not year, month, or day'
            )
            return
    # Find and store year, month, and day indices
    yearIndex = ordering.index('year')
    monthIndex = ordering.index('month')
    dayIndex = ordering.index('day')
    # Clean up dateString and split up month, day, and year
    dateString = dateString.strip()
    delimiter = ' '
    if '/' in dateString:
        delimiter = '/'
    elif '-' in dateString:
        delimiter = '-'
    date = dateString.split(delimiter)
    # Parse year string to int
    year = date[yearIndex].strip()
    if len(year) == 2:
        year = '20' + year
    year = int(re.sub("[^0-9]", "", year))
    # Parse month string to int
    month = month_to_num(date[monthIndex].strip())
    # Parse day string to int
    day = date[dayIndex].strip()
    day = int(re.sub("[^0-9]", "", day))
    # Return datetime object
    return datetime(year, month, day)
