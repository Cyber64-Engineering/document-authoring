export default {
  fees: {
    total: 4,
    offset: 0,
    limit: 4,
    data: [
      {
        kind: 'other',
        title: 'Osiguranje CPI',
        fixedAmount: '0',
        code: 'RSD',
      },
      {
        kind: 'other',
        title: 'Trošak menice',
        fixedAmount: '50',
        code: 'RSD',
      },
      {
        kind: 'other',
        title: 'Trošak povlačenja izveštaja KB Korisnik',
        fixedAmount: '246',
        code: 'RSD',
      },
      {
        kind: 'other',
        title: 'Trošak vođenja računa paketa',
        fixedAmount: '0',
        code: 'RSD',
      },
    ],
  },
  interestRate: {
    total: 1,
    offset: 0,
    limit: 1,
    data: [
      {
        period: '1Y',
        percentage: '7.95',
      },
    ],
  },
  interestCalculationMethod: {
    total: 1,
    offset: 0,
    limit: 1,
    data: [
      {
        interestCalculationMethod: 'proportional',
        interestCalculationBasis: '30E-360-ISDA',
        effectiveInterestRate: '8.24',
      },
    ],
  },
  ':version': 3,
  ':names': ['fees', 'interestRate', 'interestCalculationMethod'],
  ':type': 'multi-sheet',
};
