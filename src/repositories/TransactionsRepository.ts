import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };

    //   let incomeSum = 0;
    //   let outcomeSum = 0;
    //   let totalSum = 0;

    //   transactions.forEach(transaction => {
    //     if (transaction.type === 'income') {
    //       incomeSum += Number(transaction.value);
    //     } else if (transaction.type === 'outcome') {
    //       outcomeSum += Number(transaction.value);
    //     }
    //   });

    //   totalSum = incomeSum - outcomeSum;

    //   const balance = {
    //     income: incomeSum,
    //     outcome: outcomeSum,
    //     total: totalSum,
    //   } as Balance;

    //   return balance;
  }
}

export default TransactionsRepository;
