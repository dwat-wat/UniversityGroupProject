
import azure.functions as func
import praw
from textblob import TextBlob
from psaw import PushshiftAPI
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity
import logging  
import datetime as dt
import time
def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    startDate = req.params.get('startDate')
    endDate = req.params.get('endDate')
    currency = req.params.get('currency')
    if not (startDate and endDate):   
        try:
            req_body = req.get_json()
        except ValueError:
            return func.HttpResponse('error')
        else:
            startDate = req_body.get('startDate')
            endDate = req_body.get('endDate')
    if (startDate and endDate):
        table_service = TableService(account_name='sauokgp', account_key='113mdwUqIiqt4K2HonK80HakIOplxYZINmQME5KB1IZfP+v3JHZK64wpoTP5NBFaG0MaO/TVqA0nW4KuCINTow==')

        reddit = praw.Reddit(client_id = 'sCanLl76vO0ExA',
                            client_secret = '54qOmHpy2PBRLTVs8soyBhif42A',
                            user_agent = 'CryptoCollector')

        api = PushshiftAPI(reddit)

        d1 = int(time.mktime(dt.datetime.strptime(startDate, "%Y-%m-%d").timetuple()))
        d2 = int(time.mktime(dt.datetime.strptime(endDate, "%Y-%m-%d").timetuple()))

        gen = api.search_submissions(before=d2,after=d1,subreddit = currency,limit = 20,sort_type ='score')

        results = list(gen)

        #creates Reddit table if one doesn't already exist
        if not(table_service.exists('Reddit')):
            table_service.create_table('Reddit',fail_on_exist=False)

        highest_polarity = -1
        lowest_polarity = 1
        total_polarity = 0
        total_subjectivity = 0
        count = 0

        positives = ['top','rise','stable','bullish','rally','spike','bull','surge','surges']
        negatives = ['fall','drop','unstable','tank','panic','bearish']

        for i in results:
            submission = reddit.submission(id=i)
            sentiment = TextBlob(submission.title)
            polarity = sentiment.sentiment.polarity
            subjectivity = sentiment.sentiment.subjectivity
            print(submission.title)
            for x in positives:
                positive = submission.title.count(x)
            for x in negatives:
                negative = submission.title.count(x)
            if positive > negative:
                polarity = 1
            if negative > positive:
                polarity = -1
            if polarity != 0:
                total_polarity+=polarity
                total_subjectivity+=subjectivity
                count+=1   
            
        print('=============================')
        print('Total Polarity: ' + str(total_polarity))
        print('Number of Posts: ' + str(count))
        print('=============================')
        if count != 0:
            total_polarity = total_polarity/count
        print('Reddit Polarity Rating: ' + str(total_polarity))
        print('=============================')
                #post = {'PartitionKey': 'postsReddit','RowKey': submission.id,'Polarity': total_polarity, 'Subjectivity': total_subjectivity,'Date': dt.utcfromtimestamp(submission.created_utc),'pos_post':pos_url,'neg_post': neg_url}
                #print(post)
        return func.HttpResponse('%' + str(total_polarity*100))
    else:
        return func.HttpResponse(
            "Please pass the correct parameters on the query string or in the request body",
            status_code=400
        )