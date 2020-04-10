from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity, EntityProperty, EdmType
from azure.cosmosdb.table.tablebatch import TableBatch
# import httplib3
import json
# import urllib3
import requests
import threading
import datetime
import logging

import azure.functions as func

time = []
#timestamps = []
timez = []
openz = []
close = []
high = []
low = []
bitcoins = []

Bitcoinz = "BTC"


def liveDataGetter():
    theApiUrl = "https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=GBP&limit=1&api_key=cb2d49b598be23432f235ed0c6fe7d96ee2c6d7e2b6459bb6077cbfa21f0b403"
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
        connection_string='DefaultEndpointsProtocol=https;AccountName=sauokgp;AccountKey=113mdwUqIiqt4K2HonK80HakIOplxYZINmQME5KB1IZfP+v3JHZK64wpoTP5NBFaG0MaO/TVqA0nW4KuCINTow==;EndpointSuffix=core.windows.net')

    batch = TableBatch()
    inBatch = 0
    for a in bitcoins:
        batch.insert_or_replace_entity(a)
        inBatch += 1
        if inBatch > 99:
            table_service.commit_batch('CryptoCompareAPIDataFinal', batch)
            batch = TableBatch()
            inBatch = 0
    table_service.commit_batch('CryptoCompareAPIDataFinal', batch)
    batch = TableBatch()
    inBatch = 0


def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function ran at %s', utc_timestamp)

    try:
        liveDataGetter()
        addingEntity()
        sendEntities()
    except Exception as e:
        logging.error('The Error: ')
        logging.error(e)