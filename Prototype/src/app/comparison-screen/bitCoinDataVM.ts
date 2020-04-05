export interface BitCoinDataVM {
  bitCoinOwned: number;
  currentBitCoinValue: number;
  timeStamp: Date;
  week: string;
}

export interface FinalOutputVM {
  finalResults: BitCoinDataVM[];
  accountBalance: number;
  currentOwned: number;
}
