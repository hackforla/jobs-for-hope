'''
Module to load scraper as plugins
'''
import imp
import os

ScraperFolder = './scrapers'
MainModule = '__init__'

def getScrapers():
    scrapers = []
    possible_scrapers = os.listdir(ScraperFolder)
    #print(possible_scrapers)
    for i in possible_scrapers:
        location = os.path.join(ScraperFolder, i)
        #print(location)
        #print( os.path.splitext(location)[-1].lower() == '.py')
        if os.path.isdir(location) or not os.path.splitext(location)[-1].lower() == '.py':
            continue
        scrapers.append({'name': i, 'path': location})
    #print(scrapers)
    return scrapers

def loadScraper(scraper):
    #print('Loading module %s' % scraper['path'])
    #print('Loading module %s' % scraper['name'])

    searchPath, file = os.path.split(scraper['path'])
    moduleName, ext = os.path.splitext(file)
    fp, pathName, description = imp.find_module(moduleName, [searchPath,])

    return imp.load_module(moduleName, fp, pathName, description)
