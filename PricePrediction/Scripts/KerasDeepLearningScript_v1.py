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
from keras.models import Sequential

file = open("ApiKeyandConnectionString.txt","r")
config = file.readlines();
tablestorageconnectionstring = config[1];
entities = []

# Get all data from table storage 
x_train = []
y_train = []

def keras_prediction():
    
    # Keras Deep learning
    kerasmodel = Sequential()
    kerasmodel.compile(loss='categorical_crossentropy',
              optimizer='sgd',
              metrics=['accuracy'])
    
    kerasmodel.fit(x_train, y_train, epochs=5, batch_size=32)
    
def get_data():
    #try:
        table_service = TableService(connection_string=tablestorageconnectionstring)
        entities = table_service.query_entities('PredictionData', filter="")
        
        for e in entities:
            if(e.Actual.value > 0):
                x_train.append(str(e.RowKey.value))
                y_train.append(e.Actual.value)
                       
        print(x_train)
    #except:
        #print("Error")

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