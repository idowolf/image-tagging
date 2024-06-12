import { useCallback, useEffect, useRef, useState } from 'react';
import { searchImages } from '../routes/images';
import { isSetsEqual } from '../extensions/set';

export interface HandleSearchProps {
  tags: Set<string> | null;
  pageNumber: number | null;
}

/**
 * Custom hook for image search functionality.
 * @param initialTags - The initial set of tags to search for.
 * @returns An object containing search result, search handler, page setter, hasMore flag, and selected tags.
 */
export const useImageSearch = (initialTags: Set<string> = new Set()) => {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(initialTags);
  const [page, setPage] = useState<number>(0);

  const pageRef = useRef<number>(0);
  pageRef.current = page;

  const hasMoreRef = useRef<boolean>(true);
  hasMoreRef.current = hasMore;

  const selectedTagsRef = useRef<Set<string>>(initialTags);
  selectedTagsRef.current = selectedTags;

  useEffect(() => {
    const handleScroll = (event: any) => {
      const currentHeight = event.target.clientHeight;
      const newHeight = event.target.scrollHeight - event.target.scrollTop;
      // Check if distance is small enough to trigger loading more images
      const bottom = Math.abs(currentHeight - newHeight) < 2;
      if (bottom && hasMore) {
        handleSearch({ tags: null, pageNumber: null });
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [hasMore]);

  /**
   * Handles the image search based on the provided tags.
   * @param newTags - The new set of tags to search for.
   */
  const handleSearch = async ({ tags = null, pageNumber = null }: HandleSearchProps) => {
    const page = pageRef.current;
    const hasMore = hasMoreRef.current;
    const selectedTags = selectedTagsRef.current;

    const newTags = tags || selectedTags;
    const currPage = pageNumber || (page + 1);
    const isSameSet = isSetsEqual(newTags, selectedTags);
    if (repeatedSearchIsOutOfPages(hasMore, isSameSet)) return;
    if (clearSearchIfEmpty(newTags)) return;
    const results = await executeSearch(newTags, currPage, isSameSet);
    if (!isSameSet) {
      setSearchResult(results);
    } else {
      setSearchResult(prevResults => [...prevResults, ...results]);
    }
    setSelectedTags(newTags);
    setPage(currPage);  
    setHasMore(results.length > 0);
  }

  /**
   * Checks if the repeated search is out of pages.
   * @param hasMore Determines if there are more pages to load in the current search.
   * @param isSameSet Determines if the new tags are the same as the selected tags.
   * @returns True if the repeated search is out of pages, false if new search or there are more pages.
   */
  const repeatedSearchIsOutOfPages = (hasMore: boolean, isSameSet: boolean) => {
    if (!hasMore && isSameSet) {
      return true;
    }
    return false;
  }
  
  /**
   * Clears the search if the new tags are empty.
   * @param newTags The new set of tags to search for.
   * @returns True if the search is cleared, false otherwise.
   */
  const clearSearchIfEmpty = (newTags: Set<string>) => {
    if (newTags.size === 0) {
      setSearchResult([]);
      setSelectedTags(newTags);
      setHasMore(false);
      setPage(0);
      return true;
    }
    return false;
  }
  
  /**
   * Executes the search based on the provided tags.
   * @param newTags The new set of tags to search for.
   * @param currPage The current page number.
   * @param newSearch Determines if this is a new search.
   * @returns The search results.
   */
  const executeSearch = async (newTags: Set<string>, currPage: number, newSearch: boolean): Promise<any> => {
    const data = {
      tags: newTags,
      pageNumber: currPage,
      pageSize: 20
    };

    try {
      const response = await searchImages(data);
      const updatedResults = response.data.map((item: { key: string }) => ({
        ...item,
        key: `${process.env.REACT_APP_SERVER_URL}/${item.key}`
      }));

      return updatedResults;
      
    } catch (error) {
      console.error('Search failed', error);
      return [];
    }
  }

  return {
    searchResult,
    handleSearch,
  };
};
