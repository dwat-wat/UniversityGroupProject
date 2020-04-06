# Created by Dexter Watson DAW35

import azure.functions as func
import requests
import json
import datetime
import numpy as np
from sklearn.svm import SVR, LinearSVR
from sklearn.preprocessing import PolynomialFeatures as pf
from sklearn.linear_model import LinearRegression
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.tablebatch import TableBatch
from azure.cosmosdb.table.models import Entity, EntityProperty, EdmType
from keras.models import Sequential
import datetime
import logging


# Properties
apikey = '57b9285261bf74807812697d0aa133456f7b0054c5fd040b232003cd4b22de3f'
tablestorageconnectionstring = 'DefaultEndpointsProtocol=https;AccountName=sauokgp;AccountKey=113mdwUqIiqt4K2HonK80HakIOplxYZINmQME5KB1IZfP+v3JHZK64wpoTP5NBFaG0MaO/TVqA0nW4KuCINTow==;EndpointSuffix=core.windows.net'

dates = []
shortdates = []
timestamps = []
prices = []
filesforblob = []

entities = []

CURRENCY = 'BTC'

# Functions

def predict_prices(x):
    _dates = np.reshape(dates, (len(dates), 1))
    
    svr_rbf = SVR(C=1e3, gamma = 0.1)
    svr_rbf.fit(_dates, prices)
    
    lin_reg = LinearRegression()
    lin_reg.fit(_dates, prices)
    
    poly_reg = pf(degree=2)
    X_poly = poly_reg.fit_transform(_dates)
    pol_reg = LinearRegression()
    pol_reg.fit(X_poly, prices)
    
    prediction_rbf = svr_rbf.predict(np.array(x).reshape(1, 1))[0]
    prediction_lin = lin_reg.predict(np.array(x).reshape(1, 1))[0]
    prediction_poly = pol_reg.predict(poly_reg.fit_transform([[x]]))
    prediction_combo = (
        (prediction_rbf*0.28791198607186473)+
        (prediction_lin*0.5628614578028085)+
        (prediction_poly*0.14922655612532662))[0]
       
    return prediction_rbf, prediction_lin, prediction_poly, prediction_combo

def keras_prediction():
    # Get all data from table storage 
    x_train = []
    y_train = []
    
    # Keras Deep learning
    kerasmodel = Sequential()
    kerasmodel.compile(loss='categorical_crossentropy',
              optimizer='sgd',
              metrics=['accuracy'])
    
    kerasmodel.fit(x_train, y_train, epochs=5, batch_size=32)


# Daily Data
def get_data_pastdays(query, ndays):
    global dates
    global prices
    global shortdates
    global timestamps
    if len(dates) > 0:
        dates = []
        prices = []
        shortdates = []
        timestamps = []
    url = "https://min-api.cryptocompare.com/data/v2/" + query + str(ndays) + "&api_key=" + apikey
    response = requests.get(url)
    if response.status_code == 200:
        res = json.loads(response.content)     
        i = 0
        data = res["Data"]["Data"]        
        for n in range(ndays):
            _date = datetime.datetime(1, 1, 1) + datetime.timedelta(seconds=data[i]["time"])
            _date = _date.replace(year=_date.year + 1969)
            timestamps.append(data[i]["time"])
            shortdates.append(_date.strftime("%y") + str(_date.timetuple().tm_yday).zfill(3))
            dates.append(i)
            prices.append(float(data[i]["close"]))
            i += 1
    else:
        print("Error: ", response.status_code)
    return

def add_entity(currency, day, rbf, linear, poly, actual, comboV1):
    print("\nAdded Entity: ", "\nCurrency: ", currency, "\nDay: ", day, "\nRBF: ", rbf, "\nLinear: ", linear, "\nPolynomial: ", poly, "\nActual: ", actual, "\nComboV1: ", comboV1)
    
    entity = {'PartitionKey': currency, 'RowKey': day, 'RBF': EntityProperty(EdmType.DOUBLE, rbf), 'Linear': EntityProperty(EdmType.DOUBLE, linear), 'Polynomial': EntityProperty(EdmType.DOUBLE, poly),'Actual': EntityProperty(EdmType.DOUBLE, actual),'ComboV1': EntityProperty(EdmType.DOUBLE, comboV1)}
    entities.append(entity)
    if(len(entities) > 99):
        uploadentities()

def alldata():
    print("All Data:\n")
    nextactual = 0
    ndays = 10
    get_data_pastdays("histoday?fsym="+CURRENCY+"&tsym=GBP&limit=", ndays)
    predictedprices = predict_prices(ndays)
    add_entity(CURRENCY, 
                 str(int(shortdates[len(dates)-1])+1), 
                 predictedprices[0], 
                 predictedprices[1], 
                 predictedprices[2][0],
                 nextactual,
                 predictedprices[3])
    for i in range(0, 20):
        nextactual = prices[-1]
        get_data_pastdays("histoday?fsym="+CURRENCY+"&tsym=GBP&toTs=" + str(timestamps[-1]) + "&limit=", ndays)
        predictedprices = predict_prices(ndays)
        try:
            add_entity(CURRENCY, 
                         str(int(shortdates[len(dates)-1])+1), 
                         predictedprices[0], 
                         predictedprices[1], 
                         predictedprices[2][0],
                         nextactual,
                         predictedprices[3]) 
            
        except:
            print("Failed to insert entity.")
        print("\nTomorrows price: ", "\nRBF £", predictedprices[0], "\nLinear £", predictedprices[1], "\nPolynomial £", predictedprices[2][0], "\nCombination £", predictedprices[3])

      
def uploadentities():
    table_service = TableService(connection_string=tablestorageconnectionstring)
    
    batch = TableBatch()
    inBatch = 0
    for e in entities:
        batch.insert_or_replace_entity(e)        
        inBatch += 1
        if inBatch > 99:
            print("\nSending batch...")
            table_service.commit_batch('PredictionData', batch)
            print("Batch sent!")
            batch = TableBatch()
            inBatch = 0
    print("\nSending batch...")
    table_service.commit_batch('PredictionData', batch)
    print("Batch sent!")
    batch = TableBatch()
    inBatch = 0

def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function ran at %s', utc_timestamp)
    try:
        alldata()
        uploadentities()
    except:
        logging.info("Error!")


    

