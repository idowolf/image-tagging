import React, { useState, useEffect } from 'react';
import { convertTextToTags } from '../../routes/tags';
import { useImageSearch } from '../../hooks/useImageSearch';
import { SearchResultsContainer, TagsContainer } from './styles';
import SearchResults from './SearchResults';
import CustomAutocompleteField from './CustomAutocompleteField';
import { Grid, Chip, Typography } from '@mui/material';

/**
 * Component for freeform search functionality.
 */
const FreeformSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const { searchResult, handleSearch } = useImageSearch();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [resolvedTags, setResolvedTags] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const initiateSearch = async (_newSearch: boolean = true) => {
    if (!searchInput) return;
    const newHistory = [searchInput, ...searchHistory.filter(item => item !== searchInput)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    try {
      const response = await convertTextToTags({ text: searchInput, topTagsCount: 1000 });
      const convertedTags = response.data;
      setResolvedTags(convertedTags);
      handleSearch({ tags: convertedTags, pageNumber: 1 });
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchInput) {
      initiateSearch();
    }
  };

  return (
    <SearchResultsContainer>
      <CustomAutocompleteField
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter text to search..."
        handleKeyDown={handleKeyDown}
        open={open}
        setOpen={setOpen}
        onSearchClick={initiateSearch}
        autocompleteOptions={searchHistory}
        onOptionSelected={(option) => setSearchInput(option)} />
      {resolvedTags.length > 0 && <TagsContainer>
        <Typography>These are the tags we found based on your text:</Typography>
        <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center' }}>
          {resolvedTags.map((tag, index) => (
            <Grid item key={index}>
              <Chip label={tag} deleteIcon={<div />} />
            </Grid>
          ))}
        </Grid>
      </TagsContainer>}
      <SearchResults searchResult={searchResult} />
    </SearchResultsContainer>
  );
};

export default FreeformSearch;
