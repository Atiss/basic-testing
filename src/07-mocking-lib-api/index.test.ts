// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const payload = { data: 'some response' };
const relativePath = '/some-path';

jest.mock('axios', () => {
  return {
    create: () => ({
      get: jest.fn().mockResolvedValue(payload),
    }),
  };
});

jest.mock('lodash', () => {
  return {
    throttle: jest.fn().mockImplementation((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const createMock = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(relativePath);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockResolvedValue(payload);
    const createMock = jest.spyOn(axios, 'create');
    createMock.mockReturnValue({ get: getMock } as never);
    await throttledGetDataFromApi(relativePath);
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    await expect(throttledGetDataFromApi(relativePath)).resolves.toEqual(
      payload.data,
    );
  });
});
