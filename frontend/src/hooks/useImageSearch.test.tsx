import { renderHook, act } from '@testing-library/react-hooks';
import { useImageSearch } from './useImageSearch';
import { searchImages } from '../routes/images';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

jest.mock('../routes/images');

const mockResponse: AxiosResponse = {
    data: [{ key: '/image1.jpg' }, { key: '/image2.jpg' }],
    status: 200,
    statusText: 'OK',
    headers: {}, // You can populate this with actual header values if needed
    config: {
      headers: {}, // Add necessary header details here
      method: 'get',
      url: '',
      data: {},
      timeout: 0,
      // Add other necessary properties here
    } as InternalAxiosRequestConfig, // Casting to InternalAxiosRequestConfig to ensure type compliance
  };
  

const mockSearchImages = searchImages as jest.MockedFunction<typeof searchImages>;

describe('useImageSearch', () => {
  it('should handle image search correctly', async () => {
    mockSearchImages.mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useImageSearch());

    act(() => {
      result.current.handleSearch(new Set(['tag1', 'tag2']));
    });

    await waitForNextUpdate();

    expect(result.current.searchResult).toEqual([{ key: 'http://localhost:5000//image1.jpg' }, { key: 'http://localhost:5000//image2.jpg' }]);
  });
});
