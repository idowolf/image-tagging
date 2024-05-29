import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

interface SearchSelectorProps {
  searchType: 'tags' | 'freeform';
  setSearchType: (type: 'tags' | 'freeform') => void;
}

/**
 * Renders a search selector component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.searchType - The current search type.
 * @param {Function} props.setSearchType - The function to set the search type.
 * @returns {JSX.Element} The rendered search selector component.
 */
const SearchSelector: React.FC<SearchSelectorProps> = ({ searchType, setSearchType }) => {
  return (
    <ToggleButtonGroup
      value={searchType}
      exclusive
      style={{margin: 'auto'}}
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
