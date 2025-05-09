// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'node:path';
import fs from 'node:fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(10000);
    expect(callback).toHaveBeenCalledTimes(10);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinMock = jest.spyOn(path, 'join');
    const pathToFile = 'test.txt';
    await readFileAsynchronously(pathToFile);
    expect(joinMock).toHaveBeenCalledTimes(1);
  });

  test('should return null if file does not exist', async () => {
    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    existsSyncMock.mockReturnValue(false);
    const pathToFile = 'nonexistent.txt';
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    const readFileMock = jest.spyOn(fs.promises, 'readFile');
    const pathToFile = 'test.txt';
    const fileContent = 'Hello, world!';
    existsSyncMock.mockReturnValue(true);
    readFileMock.mockResolvedValue(Buffer.from(fileContent));
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent);
  });
});
