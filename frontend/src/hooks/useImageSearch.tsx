import { useState, useEffect } from 'react';
import { searchImages } from '../services/api';
import { isSetsEqual } from '../extensions/set';

export const useImageSearch = (initialTags: Set<string> = new Set()) => {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(initialTags);

  const handleSearch = (newTags: Set<string> | null = null) => {
    if (!newTags || newTags.size === 0) return;
    const newSearch = newTags && !isSetsEqual(newTags, selectedTags);
    setSelectedTags(newTags);
    const data = {
      tags: newTags,  
      pageNumber: newSearch ? 1 : page,
      pageSize: 10
    };

    searchImages(data).then(response => {
      const updatedResults = response.data.map((item: { key: string }) => ({
        ...item,
        key: `http://localhost:5000/${item.key}`
      }));

      if (newSearch) {
        setSearchResult(updatedResults);
      } else {
        setSearchResult(prevResults => [...prevResults, ...updatedResults]);
      }

      setHasMore(response.data.length > 0);
      if (newSearch) setPage(2);
    });
  };

  useEffect(() => {
    const handleScroll = (event: any) => {
      const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
      if (bottom && hasMore) {
        handleSearch();
        setPage(prevPage => prevPage + 1);
      }
    };

    const scrollContainer = document.getElementById('scrollable-image-section');
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return {
    searchResult,
    handleSearch,
    setPage,
    hasMore,
    selectedTags,
  };
};
