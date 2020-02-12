using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Azure.Cosmos.Table;

namespace CryptoCompareBitcoinData.Model
{
    class BitcoinEntity : TableEntity
    {
        public BitcoinEntity()
        {
        }

        public BitcoinEntity(string time, string open, string close)
        {
            PartitionKey = time;
            RowKey = open;
        }

        public string SomeData { get; set; }
        public string SomeMoreData { get; set; }
    }
}
