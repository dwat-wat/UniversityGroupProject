using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using CryptoCompareBitcoinData.Model;
using Microsoft.Azure.Cosmos.Table;
using System.Net;
using System.IO;
using System.Linq;

namespace CryptoCompareBitcoinData
{
    class BasicSamples
    {
        public async Task RunSamples()
        {
            Console.WriteLine("Azure Cosmos DB Table - Basic Samples\n");
            Console.WriteLine();

            string tableName = "demo" + Guid.NewGuid().ToString().Substring(0, 5);

            // Create or reference an existing table
            CloudTable table = await Common.CreateTableAsync(tableName);

            try
            {
                // Demonstrate basic CRUD functionality 
                await BasicDataOperationsAsync(table);
            }
            finally
            {
                // Delete the table
                // await table.DeleteIfExistsAsync();
            }
        }

        private static async Task BasicDataOperationsAsync(CloudTable table)
        {

            // Create an instance of a customer entity. See the Model\CustomerEntity.cs for a description of the entity.
            BitcoinEntity bitcoin = new BitcoinEntity("10982384", "2323", "2022")
            {
                SomeData = "2444",
                SomeMoreData = "1997"
            };

            // Demonstrate how to insert the entity
            Console.WriteLine("Insert an Entity.");
            bitcoin = await SamplesUtils.InsertOrMergeEntityAsync(table, bitcoin);

            // Demonstrate how to Update the entity by changing the phone number
            Console.WriteLine("Update an existing Entity using the InsertOrMerge Upsert Operation.");
            bitcoin.SomeMoreData = "425-555-0105";
            await SamplesUtils.InsertOrMergeEntityAsync(table, bitcoin);
            Console.WriteLine();

            // Demonstrate how to Read the updated entity using a point query 
            Console.WriteLine("Reading the updated Entity.");
            bitcoin = await SamplesUtils.RetrieveEntityUsingPointQueryAsync(table, "Harp", "Walter");
            Console.WriteLine();

            // Demonstrate how to Delete an entity
            //Console.WriteLine("Delete the entity. ");
            //await SamplesUtils.DeleteEntityAsync(table, customer);
            //Console.WriteLine();
        }
    }

    class Connect
    {
        public string theDataGetter()
        {
            string html = string.Empty;
            string url = @"https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=GBP&limit=1999&api_key={cb2d49b598be23432f235ed0c6fe7d96ee2c6d7e2b6459bb6077cbfa21f0b403}";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.AutomaticDecompression = DecompressionMethods.GZip;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                html = reader.ReadToEnd();
            }

            Console.WriteLine(html);

        }
    }
}
