# Created by Dexter Watson DAW35

from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity, EntityProperty, EdmType
import matplotlib.pyplot as plt

tablestorageconnectionstring = ''

rLinear = 100.0
rRBF = 100.0
rPoly = 100.0

predictions = [rLinear, rRBF, rPoly]

runs = []
diffs = []

totalDiff = 0.0
avgDiff = 0.0

c = 1.0

# Classes

class MyEntity(object):
    def __init__(self, entity):
        #print(entity)
        self.Currency = entity.PartitionKey
        self.Actual = float(entity.Actual)
        self.RBF = entity.RBF
        self.Linear = entity.Linear
        self.Polynomial = entity.Polynomial


# Functions

def calculatePrediction(e):
    prediction = 0.0;
    
    prediction += e.Linear * (predictions[0] / (predictions[0] + predictions[1] + predictions[2]));
    prediction += e.RBF * (predictions[1] / (predictions[0] + predictions[1] + predictions[2]));
    prediction += e.Polynomial * (predictions[2] / (predictions[0] + predictions[1] + predictions[2]));
    
    return prediction;

def calc():
    j = 0
    totalDiff = 0.0
    avgDiff = 0.0
    
    for e in entities:
        actual = e.Actual
        prediction = calculatePrediction(e)
        diff = ((actual - prediction)/actual if actual > prediction else (prediction - actual)/prediction) * 100
        totalDiff += diff        
        j += 1
            
    avgDiff = totalDiff / j
    return avgDiff
    
def change():
    global rLinear
    rLinear = rLinear + c

# Main
    
table_service = TableService(connection_string=tablestorageconnectionstring)

eentities = table_service.query_entities('PredictionData', filter="")
entities = []

try:
    for e in eentities:
        entities.append(MyEntity(e))
except:
    print("")
n = 0
for e in entities:
    actual = e.Actual
    prediction = calculatePrediction(e)
    diff = ((actual - prediction)/actual if actual > prediction else (prediction - actual)/prediction) * 100
    totalDiff += diff        
    n += 1
avgDiff = totalDiff / n
print("%" + str(avgDiff))

pd = avgDiff
ad = 0.0
k = 0
#for k in range(1, 100):
while ad != pd:
    j = 0
    pd = avgDiff
    for p in predictions:
        prevDiff = avgDiff
        avgDiff = 0.0
        c = 1.0
        #print("Prediction " + str(j+1))
        while avgDiff != prevDiff:
        #for k in range(1, 10):
            op = predictions[j]
            predictions[j] = op + c
            prevDiff = avgDiff
            avgDiff = calc()            
            if avgDiff > prevDiff:
                predictions[j] = op - c
                avgDiff = calc()
                if avgDiff > prevDiff:
                    c = c/2         
                    predictions[j] = op
            #print("%" + str(avgDiff))
        j = j + 1
    print("%" + str(avgDiff))
    runs.append(k)
    diffs.append(avgDiff)
    k = k + 1
    ad = avgDiff


plt.plot(runs, diffs, color='green', label='Average Accuracy (%)')
plt.xlabel('Run')
plt.ylabel('Accuracy (%)')
plt.title('Price Prediction Accuracy')
plt.legend()
plt.show()

print("Prediction Types:"
      +"\nLinear:       "+str(predictions[0])
      +"\nRBF:          "+str(predictions[1])
      +"\nPolynomial:   "+str(predictions[2])
      +"\nAccuracy:    %"+str(avgDiff))
print("% Prediction Types:\n"
      + "\nLinear:     %" + str((predictions[0] / (predictions[0] + predictions[1] + predictions[2]))*100)
      + "\nRBF:        %" + str((predictions[1] / (predictions[0] + predictions[1] + predictions[2]))*100)
      + "\nPolynomial: %" + str((predictions[2] / (predictions[0] + predictions[1] + predictions[2]))*100))
    
    
    
    