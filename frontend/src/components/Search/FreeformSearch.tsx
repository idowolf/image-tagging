import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const FreeformSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = () => {
    if (searchInput) {
      const newHistory = [searchInput, ...searchHistory.filter(item => item !== searchInput)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        placeholder="Enter your search..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        fullWidth
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <List>
        {searchHistory.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FreeformSearch;
