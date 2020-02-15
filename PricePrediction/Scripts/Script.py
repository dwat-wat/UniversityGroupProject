# Created by Dexter Watson DAW35

import requests
import json
import datetime
import numpy as np
from sklearn.svm import SVR, LinearSVR
from sklearn.preprocessing import PolynomialFeatures as pf
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity, EntityProperty, EdmType
from azure.storage.blob import BlobServiceClient

# Properties
apikey = '57b9285261bf74807812697d0aa133456f7b0054c5fd040b232003cd4b22de3f'
tablestorageconnectionstring = 'DefaultEndpointsProtocol=https;AccountName=sauokgp;AccountKey=113mdwUqIiqt4K2HonK80HakIOplxYZINmQME5KB1IZfP+v3JHZK64wpoTP5NBFaG0MaO/TVqA0nW4KuCINTow==;EndpointSuffix=core.windows.net'

dates = []
shortdates = []
timestamps = []
prices = []
filesforblob = []

CURRENCY = 'BTC'

# Classes

# Functions

def predict_prices(x):
    _dates = np.reshape(dates, (len(dates), 1))
    
    svr_rbf = SVR(C=1e3, gamma = 0.1)
    svr_rbf.fit(_dates, prices)
    
    lin_reg = LinearRegression()
    lin_reg.fit(_dates, prices)
    
    poly_reg = pf(degree=4)
    X_poly = poly_reg.fit_transform(_dates)
    pol_reg = LinearRegression()
    pol_reg.fit(X_poly, prices)
    
    plt.scatter(_dates, prices, color='blue', label='Data')
    plt.plot(_dates, svr_rbf.predict(_dates), color='green', label='RBF Model')
    plt.plot(_dates, lin_reg.predict(_dates), color='red', label='Linear Model')
    plt.plot(_dates, pol_reg.predict(poly_reg.fit_transform(_dates)), color='orange', label='Polynomial Model')
    
    prediction_rbf = svr_rbf.predict(np.array(x).reshape(1, 1))[0]
    prediction_lin = lin_reg.predict(np.array(x).reshape(1, 1))[0]
    prediction_poly = pol_reg.predict(poly_reg.fit_transform([[x]]))
    
    plt.scatter([x], [prediction_rbf], color='green', label='RBF Prediction')
    plt.scatter([x], [prediction_lin], color='red', label='Linear Prediction')
    plt.scatter([x], [prediction_poly], color='orange', label='Polynomial Prediction')
    
    plt.xlabel('Date (Day)')
    plt.ylabel('Price (£)')
    plt.title('Price Prediction')
    plt.legend()
    filename = CURRENCY + '_' + shortdates[len(dates)-1] + '.png'
    plt.savefig('../Documents/Generated_Graphs/'+filename)
    filesforblob.append(filename)
    plt.show()   
    
    return prediction_rbf, prediction_lin, prediction_poly

# Monthly Data
def get_data_thismonth(query):
    url = "https://min-api.cryptocompare.com/data/v2/" + query + str(datetime.datetime.today().timetuple().tm_yday-1) + "&api_key=" + apikey
    response = requests.get(url)
    if response.status_code == 200:
        res = json.loads(response.content) 
    
        for data in res["Data"]["Data"]:
            _date = datetime.datetime(1, 1, 1) + datetime.timedelta(seconds=data["time"])
            #_date = _date.replace(year=_date.year + 1969)
            dates.append(_date.day)
            prices.append(float(data["open"]))
    else:
        print("Error: ", response.status_code)
    return
    
def thismonth():
    print("This Month:\n")
    get_data_thismonth("histoday?fsym="+CURRENCY+"&tsym=GBP&limit=")
    predictedprices = predict_prices(datetime.datetime.today().day + 1) #(datetime.datetime.today()+datetime.timedelta(days=1)).day
    print("Tomorrows price: ", "\nRBF £", predictedprices[0], "\nLinear £", predictedprices[1], "\nPolynomial £", predictedprices[2])

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
        i = 0;
        for data in res["Data"]["Data"]:
            _date = datetime.datetime(1, 1, 1) + datetime.timedelta(seconds=data["time"])
            _date = _date.replace(year=_date.year + 1969)
            timestamps.append(data["time"])
            shortdates.append(_date.strftime("%y") + str(_date.timetuple().tm_yday).zfill(3))
            dates.append(i)
            prices.append(float(data["close"]))
            i += 1
    else:
        print("Error: ", response.status_code)
    return

def pastdays(ndays):
    print("Past " + str(ndays) +" days:\n")
    get_data_pastdays("histoday?fsym="+CURRENCY+"&tsym=GBP&limit=", ndays)
    predictedprices = predict_prices(ndays+1)
    update_table(CURRENCY, shortdates[len(dates)-1], predictedprices[0], predictedprices[1], predictedprices[2][0], 0)
    print("Tomorrows price: ", "\nRBF £", predictedprices[0], "\nLinear £", predictedprices[1], "\nPolynomial £", predictedprices[2][0])

def update_table(currency, day, rbf, linear, poly, actual):
    print("Updating table: ", "\nCurrency: ", currency, "\nDay: ", day, "\nRBF: ", rbf, "\nLinear: ", linear, "\nPolynomial: ", poly, "\nActual: ", actual)
    table_service = TableService(connection_string=tablestorageconnectionstring)
    
    entity = {'PartitionKey': currency, 'RowKey': day, 'RBF': EntityProperty(EdmType.DOUBLE, rbf), 'Linear': EntityProperty(EdmType.DOUBLE, linear), 'Polynomial': EntityProperty(EdmType.DOUBLE, poly),'Actual': EntityProperty(EdmType.DOUBLE, actual)}
    table_service.insert_or_replace_entity('PredictionData', entity)

def alldata():
    print("All Data:\n")
    nextactual = 0
    ndays = 10
    get_data_pastdays("histoday?fsym="+CURRENCY+"&tsym=GBP&limit=", ndays)
    predictedprices = predict_prices(ndays+1)
    update_table(CURRENCY, 
                 shortdates[len(dates)-1], 
                 predictedprices[0], 
                 predictedprices[1], 
                 predictedprices[2][0],
                 nextactual)
    for i in range(0, 2000):
        nextactual = prices[-1]
        get_data_pastdays("histoday?fsym="+CURRENCY+"&tsym=GBP&toTs=" + str(timestamps[-2]) + "&limit=", ndays)
        predictedprices = predict_prices(ndays+1)
        try:
            update_table(CURRENCY, 
                         shortdates[len(dates)-1], 
                         predictedprices[0], 
                         predictedprices[1], 
                         predictedprices[2][0],
                         nextactual) 
            
        except:
            print("Failed to insert entity.")
        print("\nTomorrows price: ", "\nRBF £", predictedprices[0], "\nLinear £", predictedprices[1])

def uploadblobs():
    blob_service_client = BlobServiceClient.from_connection_string(tablestorageconnectionstring)
    print("\nGenerated Graphs:")
    for f in filesforblob:
        print(f)
        blob_client = blob_service_client.get_blob_client(container='blob-container', blob=f)
        with open('../Documents/Generated_Graphs/'+f, "rb") as graph:
            blob_client.upload_blob(graph)
        

# Main    

#thismonth()
pastdays(10)
#try:
    #alldata()
#except:
 #   print("Error!")
#uploadblobs()

