/**
This function takes in a word and a count and returns
a pluralized version of the word if the count is greater
than 1, or the word itself otherwise.
*/
export const pluralize = (word: string, count: number): string =>
  count === 1 ? word : `${word}s`
