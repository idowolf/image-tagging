import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, InputAdornment, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { convertTextToTags } from '../../services/api';
import { useImageSearch } from '../../hooks/useImageSearch';
import { SearchContainer, SearchIconPadding, SearchResultsContainer } from './styles';
import SearchResults from './SearchResults';

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
      <SearchContainer>
        <Autocomplete
          freeSolo
          fullWidth
          options={searchHistory}
          value={searchInput}
          onInputChange={(_event, newInputValue) => setSearchInput(newInputValue || '')}
          renderInput={(params) => (
            <TextSearchField params={params} initiateSearch={() => initiateSearch()} />
          )}
        />
      </SearchContainer>
      <SearchResults searchResult={searchResult} handleSearch={handleSearch} setPage={setPage} hasMore={hasMore} />
    </SearchResultsContainer>
  );
};

interface TextSearchFieldProps {
  params: any;
  initiateSearch: () => void;
}

const TextSearchField: React.FC<TextSearchFieldProps> = ({ params, initiateSearch }) => {
  return (
    <TextField
      {...params}
      fullWidth
      style={{ padding: '0', height: '46px' }}
      variant="outlined"
      placeholder="Enter your search..."
      InputProps={{
        style: SearchIconPadding,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => initiateSearch()}>
              <SearchIcon color="primary" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export default FreeformSearch;
