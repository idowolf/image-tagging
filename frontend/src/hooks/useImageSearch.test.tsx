import { renderHook, act } from '@testing-library/react-hooks';
import { useImageSearch } from './useImageSearch';
import { searchImages } from '../routes/images';

jest.mock('../routes/images');

const mockSearchImages = searchImages as jest.MockedFunction<typeof searchImages>;

describe('useImageSearch', () => {
  it('should handle image search correctly', async () => {
    mockSearchImages.mockResolvedValueOnce({ data: [{ key: '/image1.jpg' }, { key: '/image2.jpg' }] });

    const { result, waitForNextUpdate } = renderHook(() => useImageSearch());

    act(() => {
      result.current.handleSearch(new Set(['tag1', 'tag2']));
    });

    await waitForNextUpdate();

    expect(result.current.searchResult).toEqual([{ key: 'http://localhost:5000//image1.jpg' }, { key: 'http://localhost:5000//image2.jpg' }]);
  });
});
