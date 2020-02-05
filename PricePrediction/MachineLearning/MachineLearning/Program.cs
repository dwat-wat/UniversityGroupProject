using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace MachineLearning
{
    class Program
    {
        static CloudStorageAccount storageAccount;
        static CloudTableClient tableClient;

        static void Main(string[] args)
        {
            try
            {
                run();

                Console.ReadLine();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Console.ReadKey();
            }
        }

        static async void run()
        {
            storageAccount = CloudStorageAccount.Parse("");
            tableClient = storageAccount.CreateCloudTableClient();
            CloudTable table = tableClient.GetTableReference("PredictionData");
            Console.WriteLine("Connected...");
            TableContinuationToken token = null;
            var entities = new List<PredictionDataEntity>();

            do
            {
                Console.WriteLine("Retrieving...");
                var queryResult = await table.ExecuteQuerySegmentedAsync(new TableQuery<PredictionDataEntity>(), token);
                entities.AddRange(queryResult.Results);
                token = queryResult.ContinuationToken;
            } while (token != null);
            Console.WriteLine("Done!");

            Console.WriteLine($"Count: {entities.Count}");
            //Console.WriteLine($"1st Entity:\nCurrency: {entities[0].Currency} Row Key: {entities[0].RowKey} RBF: {entities[0].RBF} Linear: {entities[0].Linear} Polynomial: {entities[0].Polynomial} Actual: {entities[0].Actual}");

            Machine machine = new Machine(entities);
        }
    }
}
