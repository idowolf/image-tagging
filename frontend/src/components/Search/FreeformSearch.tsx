import React, { useState, useEffect } from 'react';
import { convertTextToTags } from '../../routes/tags';
import { useImageSearch } from '../../hooks/useImageSearch';
import { SearchResultsContainer } from './styles';
import SearchResults from './SearchResults';
import CustomAutocompleteField from './CustomAutocompleteField';

const FreeformSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const { searchResult, handleSearch, setPage, hasMore } = useImageSearch();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const initiateSearch = async (newSearch: boolean = true) => {
    if (!searchInput) return;
    const newHistory = [searchInput, ...searchHistory.filter(item => item !== searchInput)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    try {
      const response = await convertTextToTags({ text: searchInput, topTagsCount: 1000 });
      const convertedTags = response.data;
      handleSearch(convertedTags);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  return (
    <SearchResultsContainer>
      <CustomAutocompleteField
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter text to search..."
        handleKeyDown={(e) => {
          if (e.key === 'Enter') {
            initiateSearch();
          }
        }}
        open={false}
        setOpen={() => {}}
        onSearchClick={initiateSearch}
        autocompleteOptions={searchHistory}
        onOptionSelected={(option) => setSearchInput(option)} />
      <SearchResults searchResult={searchResult} handleSearch={handleSearch} setPage={setPage} hasMore={hasMore} />
    </SearchResultsContainer>
  );
};

export default FreeformSearch;
