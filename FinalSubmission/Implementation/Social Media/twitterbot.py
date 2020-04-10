import tweepy
import datetime
from datetime import datetime
from datetime import timedelta
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity
from textblob import TextBlob   


class MyStreamListener(tweepy.StreamListener):
    def on_status(self,status):
        global count
        global total_polarity
        global total_subjectivity
        global nexttime
        global volume
        global last_volume
        datetimeformat = '%Y-%m-%d %H:%M:%S'
        if (datetime.now() > nexttime):
            nexttime += timedelta(minutes = 5)
            avarage_polarity = round((total_polarity / count) * 100,2)
            avarage_subjectivity = round((total_subjectivity / count) * 100,2)
            if last_volume == 0:
                last_volume = volume
            api.update_status('For the past 5 minutes, Tweets using the Hashtag: #' + search_phrase + ' had an avarage polarity score of ' + str(avarage_polarity) + '%, and an avarage subjectivity score of ' + str(avarage_subjectivity) + '%. There were a total of ' + str(volume) + ' tweets, which is a change of ' + str(round(((volume/last_volume) - 1)*100,2)) + '%')
            print('Status Updated') 
            post = {'PartitionKey': search_phrase,'RowKey': str(datetime.now()),'Polarity':str(avarage_polarity),'Subjectivity':str(avarage_subjectivity),'Volume':str(volume)}
            table_service.insert_entity('Twitter', post)    
            total_polarity = 0
            total_subjectivity = 0
            last_volume = volume
            volume = 0
            count = 0
            #table_service.insert_entity('Twitter', post) 

        # check if the tweet is a retweet - excludes retweets
        volume+= 1
        if status.text.startswith("rt @") == False:
            sentiment = TextBlob(status.text)
            polarity = sentiment.sentiment.polarity
            subjectivity = sentiment.sentiment.subjectivity
            if polarity != 0:
                count += 1
                for x in positives:
                    positive = status.text.count(x)
                for x in negatives:
                    negative = status.text.count(x)
                if positive > negative:
                    polarity = 1
                if negative > positive:
                    polarity = -1
                total_polarity += polarity
                total_subjectivity += subjectivity
        print('Count: ' + str(count) + '. Polarity: ' + str(total_polarity) + '. Subjectivity: ' + str(total_subjectivity) + '. Volume:' + str(volume))
    def on_error(self, status_code):
        if status_code == 420:
            #returning False in on_error disconnects the stream
            return False


#authenticate with azure TableService
table_service = TableService(account_name='sauokgp', 
account_key='113mdwUqIiqt4K2HonK80HakIOplxYZINmQME5KB1IZfP+v3JHZK64wpoTP5NBFaG0MaO/TVqA0nW4KuCINTow==')

consumer_key = 'axszx3Zl6pW08aDMpH7YsgBcS'
consumer_secret = '1X3oAbiQDf1qTqnrD2eCPPrvhehqgrPF67APKux9aHTykfpr0F'
access_token = '1193874652424261635-QxV34ldMeVe4wqX4OenH2uEhkU3P7V'
access_token_secret = 'QFDrdxVjZBkW3p0oXWIiwkY35gDXLN9VVgUAFO5btYK3z'
search_phrase = 'bitcoin'

#def search_hashtags(consumer_key, consumer_secret, access_token, access_token_secret, hashtag_phrase):

# Authenticate to Twitter
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
# Create API object
api = tweepy.API(auth)

#Creating Stream object
MyStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth,listener = MyStreamListener)

#tweets = api.search(search_phrase,count = 1000)

positives = ['top','rise','stable','bullish','rally','spike']
negatives = ['fall','drop','unstable','tank','panic','bearish']

total_polarity = 0
total_subjectivity = 0
count = 0
highest_polarity = -1
lowest_polarity = 1
now = datetime.now().replace(microsecond=0).isoformat(' ')
nexttime = datetime.now() + timedelta(minutes = 5)
volume = 0
last_volume = 0
myStream.filter(track=[search_phrase])