from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity, EntityProperty, EdmType
from azure.cosmosdb.table.tablebatch import TableBatch
# import httplib3
import json
# import urllib3
import datetime
import requests
import threading

time = []
#timestamps = []
timez = []
openz = []
close = []
high = []
low = []
bitcoins = []


Bitcoinz = "BTC"



def historicalDataGetter():
    theApiUrl = ""
    print(theApiUrl)
    theApiResponse = requests.get(theApiUrl)
    print(theApiResponse)
    if theApiResponse.status_code == 200:
        theResponse = json.loads(theApiResponse.content)

        for someData in theResponse["Data"]["Data"]:
            thedate = datetime.datetime(1, 1, 1) + datetime.timedelta(seconds=someData["time"])
            thedate = thedate.replace(year=thedate.year + 1969)
            time.append(thedate)
            timez.append(int(someData["time"]))
            openz.append(float(someData["open"]))
            close.append(float(someData["close"]))
            high.append(float(someData["high"]))
            low.append(float(someData["low"]))            
    else:
        print("Did not work, error: ", theApiResponse.status_code)
    return

def azureTable():
    # table_service = TableService(account_name='', account_key='')
    table_service = TableService(
        connection_string='')

    #table_service.create_table('bitcoinData')
    i = 0
    for t in time:
        bitcoin = {'PartitionKey': Bitcoinz, 'RowKey': str(t), 'Open': EntityProperty(EdmType.DOUBLE, openz[i]),
                   'Close': EntityProperty(EdmType.DOUBLE, close[i]), 'High': EntityProperty(EdmType.DOUBLE, high[i]),
                   'Low': EntityProperty(EdmType.DOUBLE, low[i]), 'Time': timez[i], 'priority': 200}
        table_service.insert_entity('bitcoinData', bitcoin)
        i += 1

def addingEntity():
     i = 0
     for t in time:
        bitcoin = {'PartitionKey': Bitcoinz, 'RowKey': str(t), 'Open': EntityProperty(EdmType.DOUBLE, openz[i]),
                   'Close': EntityProperty(EdmType.DOUBLE, close[i]), 'High': EntityProperty(EdmType.DOUBLE, high[i]),
                   'Low': EntityProperty(EdmType.DOUBLE, low[i]), 'Time': timez[i], 'priority': 200}
        bitcoins.append(bitcoin)
        if(len(bitcoins) > 99):
            sendEntities()
        i += 1

def sendEntities():
    table_service = TableService(
        connection_string='')

    batch = TableBatch()
    inBatch = 0
    for a in bitcoins:
        batch.insert_or_replace_entity(a)
        inBatch += 1
        if inBatch > 99:
            table_service.commit_batch('CryptoCompareAPIData', batch)
            batch = TableBatch()
            inBatch = 0
    table_service.commit_batch('CryptoCompareAPIData', batch)
    batch = TableBatch()
    inBatch = 0


def loopyloop():
    i = 0
    five = 5
    for i in range(five):
        historicalDataGetter()
        addingEntity()
        sendEntities()
    i += 1

def timingfunction():
    threading.Timer(30.0, timingfunction).start()
    historicalDataGetter()
    addingEntity()
    sendEntities()

historicalDataGetter()
addingEntity()
sendEntities()
