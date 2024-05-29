import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

interface SearchSelectorProps {
  searchType: 'tags' | 'freeform';
  setSearchType: (type: 'tags' | 'freeform') => void;
}

const SearchSelector: React.FC<SearchSelectorProps> = ({ searchType, setSearchType }) => {
  return (
    <ToggleButtonGroup
      value={searchType}
      exclusive
      onChange={(event, newSearchType) => {
        if (newSearchType !== null) {
          setSearchType(newSearchType);
        }
      }}
    >
      <ToggleButton value="tags">Search by Tags</ToggleButton>
      <ToggleButton value="freeform">Freeform Search</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SearchSelector;
