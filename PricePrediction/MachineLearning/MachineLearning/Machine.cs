using System;
using System.Collections.Generic;
using System.Text;

namespace MachineLearning
{
    class Machine
    {
        List<PredictionDataEntity> entities;

        double rLinear = 100.0;
        double rRBF = 100.0;
        double rPoly = 100.0;

        double totalDiff = 0.0;

        public Machine(List<PredictionDataEntity> _entities)
        {
            entities = _entities;
            Console.WriteLine("Started the machine...");
            
            foreach(PredictionDataEntity p in entities)
            {
                double actual = p.Actual;
                double prediction = calculatePrediction(p);
                double diff = this.diff(actual, prediction);

                totalDiff += diff;
            }

            Console.WriteLine($"Inputs:\nrLinear={rLinear}\nrRBF={rRBF}\nrPoly={rPoly}\nOutput:\nTotalDiff={totalDiff}\nAverageDiff=%{averageDiff()}");
        }

        private double calculatePrediction(PredictionDataEntity p)
        {
            double prediction = 0.0;

            prediction += p.Linear * (rLinear / (rLinear + rRBF + rPoly));
            prediction += p.RBF * (rRBF / (rLinear + rRBF + rPoly));
            prediction += p.Polynomial * (rPoly / (rLinear + rRBF + rPoly));

            return prediction;
        }

        private double diff(double a, double b)
        {
            Console.WriteLine($"a={a}, b={b}");
            var d = a > b ? a - b : b - a;
            Console.WriteLine($"d={d}");
            var pd = d / a;
            Console.WriteLine($"pd={pd}");
            var r = pd * 100;
            Console.WriteLine($"r={r}");
            return r;
        }

        private double averageDiff()
        {
            return totalDiff / entities.Count;
        }
    }
}
