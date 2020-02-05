using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MachineLearning
{
    public class PredictionDataEntity:TableEntity
    {
        private string currency;
        private string day;
        private double actual;
        private double rbf;
        private double linear;
        private double polynomial;

        public string Currency
        {
            get
            {
                return currency;
            }

            set
            {
                currency = value;
            }
        }

        public string Day
        {
            get
            {
                return day;
            }

            set
            {
                day = value;
            }
        }

        public double Actual
        {
            get
            {
                return actual;
            }

            set
            {
                actual = value;
            }
        }

        public double RBF
        {
            get
            {
                return rbf;
            }

            set
            {
                rbf = value;
            }
        }

        public double Polynomial
        {
            get
            {
                return polynomial;
            }

            set
            {
                polynomial = value;
            }
        }

        public double Linear
        {
            get
            {
                return linear;
            }

            set
            {
                linear = value;
            }
        }
    }
}
