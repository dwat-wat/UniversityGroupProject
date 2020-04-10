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
from azure.cosmosdb.table.tablebatch import TableBatch
from azure.cosmosdb.table.models import Entity, EntityProperty, EdmType
from azure.storage.blob import BlobServiceClient
from keras.models import Sequential#, Dense
from keras.layers import Dense
from keras.layers import LSTM

import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy import stats
from sklearn.metrics import mean_squared_error
from math import sqrt
from random import randint
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import GRU
from keras.callbacks import EarlyStopping
from keras import initializers
from matplotlib import pyplot
from datetime import datetime
from matplotlib import pyplot as plt
import plotly.offline as py
import plotly.graph_objs as go
py.init_notebook_mode(connected=True)

file = open("ApiKeyandConnectionString.txt","r")
config = file.readlines();
tablestorageconnectionstring = config[1];
entities = []

# Get all data from table storage 
x_train = []
y_train = []
x_test = []

def keras_prediction():
    x_t = np.reshape(x_train, (len(x_train), 1))
    y_t = np.reshape(y_train, (len(y_train), 1))
    x = np.reshape(x_test, (len(x_test), 1))
    
    # Keras Deep learning
    kerasmodel = Sequential()
    kerasmodel.add(Dense(1))
    #kerasmodel.add(Dense(units=64, activation='relu', input_dim=100))
    kerasmodel.compile(loss='mean_squared_error',
              optimizer='adam',
              metrics=['accuracy'])
    
    kerasmodel.fit(x_t, y_t, epochs=10, batch_size=16)
    prediction = kerasmodel.predict(x)
    print(prediction)
    
def get_data():
    table_service = TableService(connection_string=tablestorageconnectionstring)
    entities = table_service.query_entities('PredictionData', filter="")
    
    for e in entities:
        try:
            if(float(e.Actual) > 0.0):
                x_train.append(int(e.RowKey))
                y_train.append(float(e.Actual))
        except:
            temp = []
            for x in range(10):                
                temp.append(int(e.RowKey)+x)
            x_test = temp
            print(temp)
    #print(x_train)
    #print(y_train)

def uploadentities():
    table_service = TableService(connection_string=tablestorageconnectionstring)
    
    batch = TableBatch()
    inBatch = 0
    for e in entities:
        batch.insert_or_replace_entity(e)        
        inBatch += 1
        if inBatch > 99:
            print("Sending batch...")
            table_service.commit_batch('PredictionData', batch)
            print("Batch sent!")
            batch = TableBatch()
            inBatch = 0
    print("Sending batch...")
    table_service.commit_batch('PredictionData', batch)
    print("Batch sent!")
    batch = TableBatch()
    inBatch = 0
    
get_data()
keras_prediction()