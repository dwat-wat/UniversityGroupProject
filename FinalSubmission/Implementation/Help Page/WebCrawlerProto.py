from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity, EntityProperty, EdmType
from azure.cosmosdb.table.tablebatch import TableBatch
import requests
from bs4 import BeautifulSoup

ref = []
title = []
bitcoins = []
Bitcoinz = "Bitcoin"

def bitcoinCrawler(maxi_page):
    page = 1
    while page < maxi_page:
        url = 'https://en.wikipedia.org/wiki/Bitcoin'
        source_data = requests.get(url)
        plain_text = source_data.text
        soupy = BeautifulSoup(plain_text)
        for link in soupy.findAll('div', {'p': '$0'}):
            thePara = link.get('p')
            print(thePara)
        page += 1


def bitcoinHyperlinksFromGoogle():
        url = 'https://www.google.com/search?q=bitcoin'
        source_data = requests.get(url)
        plain_text = source_data.text
        soupy = BeautifulSoup(plain_text, "html.parser")
        for link in soupy.findAll('h3', {'class': 'LC20lb DKV0Md'}):
            ref1 = link.get('href')
            title1 = link.string
            #ref.append(ref1)
            #title.append(theHypsTitle)
            print(ref1)
            print(title1)
            

def bitcoinHyperlinksFromGoogle2(userSearch):
        url = 'https://www.google.com/search?q=' + userSearch
        source_data = requests.get(url)
        plain_text = source_data.text
        soupy = BeautifulSoup(plain_text, "html.parser")
        for link in soupy.findAll('a', {'class': 'something'}):
            #ref1 = link.get('href')
            theHypsTitle = link.string
            #ref.append(ref1)
            #title.append(theHypsTitle)
            print(ref1)
            print(theHypsTitle)


def azureTable():
    # table_service = TableService(account_name='', account_key='')
    table_service = TableService(
        connection_string='DefaultEndpointsProtocol=https;AccountName=sauokgp;AccountKey=113mdwUqIiqt4K2HonK80HakIOplxYZINmQME5KB1IZfP+v3JHZK64wpoTP5NBFaG0MaO/TVqA0nW4KuCINTow==;EndpointSuffix=core.windows.net')

    #table_service.create_table('bitcoinData')
    i = 0
    for r in ref:
        bitcoin = {'PartitionKey': Bitcoinz, 'RowKey': str(r), 'Title': title[i], 'priority': 200}
        table_service.insert_entity('HelpPage', bitcoin)
        i += 1


def addingEntity():
     i = 0
     for r in ref:
        bitcoin = {'PartitionKey': Bitcoinz, 'RowKey': str(r), 'Title': title[i], 'priority': 200}
        bitcoins.append(bitcoin)
        if(len(bitcoins) > 99):
            sendEntities()
        i += 1


def sendEntities():
    table_service = TableService(
        connection_string='DefaultEndpointsProtocol=https;AccountName=sauokgp;AccountKey=113mdwUqIiqt4K2HonK80HakIOplxYZINmQME5KB1IZfP+v3JHZK64wpoTP5NBFaG0MaO/TVqA0nW4KuCINTow==;EndpointSuffix=core.windows.net')

    batch = TableBatch()
    inBatch = 0
    for a in bitcoins:
        batch.insert_or_replace_entity(a)
        inBatch += 1
        if inBatch > 99:
            table_service.commit_batch('HelpPage', batch)
            batch = TableBatch()
            inBatch = 0
    table_service.commit_batch('HelpPage', batch)
    batch = TableBatch()
    inBatch = 0


bitcoinHyperlinksFromGoogle2("bitcoin")
#addingEntity()
#sendEntities()
azureTable()