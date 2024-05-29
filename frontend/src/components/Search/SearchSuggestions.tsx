import React from 'react';
import { Box, Paper, List, ListItem, ListItemText } from '@mui/material';

interface SearchSuggestionsProps {
  suggestions: string[];
  onTagClick: (tag: string) => void;
}

/**
 * Renders a list of search suggestions.
 *
 * @component
 * @param {SearchSuggestionsProps} props - The component props.
 * @param {string[]} props.suggestions - The array of search suggestions.
 * @param {(suggestion: string) => void} props.onTagClick - The function to handle tag click event.
 * @returns {JSX.Element} The rendered component.
 */
const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onTagClick }) => {
  return (
    <Paper elevation={3} style={{ position: 'absolute', width: '100%', zIndex: 1 }}>
      <List>
        {suggestions.map((suggestion, index) => (
          <ListItem button key={index} onClick={() => onTagClick(suggestion)}>
            <ListItemText primary={suggestion} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SearchSuggestions;
