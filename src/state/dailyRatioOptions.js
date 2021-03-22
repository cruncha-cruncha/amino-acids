import { selector } from 'recoil';

export const dailyRatioOptionsState = selector({
  key: 'dailyRatioOptions',
  get: () => {
    return {
      'WHO': {
        'Histidine': 10,
        'Isoleucine': 20,
        'Leucine': 39,
        'Lysine': 30,
        'Methionine': 15,
        'Phenylalanine': 25,
        'Threonine': 15,
        'Tryptophan': 4,
        'Valine': 26
      },
      'USA': {
        'Histidine': 14,
        'Isoleucine': 19,
        'Leucine': 42,
        'Lysine': 38,
        'Methionine': 19,
        'Phenylalanine': 33,
        'Threonine': 20,
        'Tryptophan': 5,
        'Valine': 24
      }
    };
  },
});