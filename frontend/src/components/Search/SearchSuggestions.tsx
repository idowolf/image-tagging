import React from 'react';
import { Box, Paper, List, ListItem, ListItemText } from '@mui/material';

interface SearchSuggestionsProps {
  suggestions: string[];
  onTagClick: (tag: string) => void;
}

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
