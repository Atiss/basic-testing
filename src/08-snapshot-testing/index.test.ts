// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const linkedList = {
    value: 1,
    next: { value: 2, next: { value: 3, next: { value: null, next: null } } },
  };
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const result = generateLinkedList([1, 2, 3]);
    expect(result).toStrictEqual(linkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const result = generateLinkedList([1, 2, 3]);
    expect(result).toMatchSnapshot();
  });
});
