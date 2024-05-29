import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Chip, Grid, IconButton, InputAdornment, Paper, List, ListItem, ListItemText, debounce } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getTopTags, autocompleteTags, searchImages } from '../../services/api'; // Updated import path
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const SearchBox = styled.div`
  width: 90%;
  @media (min-width: 600px) {
    width: 70%;
  }
  @media (min-width: 960px) {
    width: 50%;
  }
  @media (min-width: 1280px) {
    width: 33%;
  }
`;

const TagsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const ImageResultContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 10px;
  overflow: hidden;
  display: inline-block;

  &:hover .downloadIcon {
    display: block;
  }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px; // Add this line to round the corners
`;

const DownloadButton = styled(IconButton)`
  && {
    position: absolute;
    top: 5px;
    right: 5px;
    display: none;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 5px;
  }
`;

const ImageLabel = styled.div`
  text-align: center;
  margin-top: 5px;
`;


const TagSearch: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [topTags, setTopTags] = useState<string[]>([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<any[]>([]);

  useEffect(() => {
    getTopTags().then(response => {
      const tags = response.data; // Assuming the API response has data property
      setTopTags(tags);
      setAutocompleteOptions(tags);
    });
  }, []);

  useEffect(() => {
    console.log("searchInput", searchInput);
  }, [searchInput]);

  const fetchSuggestions = useCallback(
    debounce((input: string) => {
      autocompleteTags(input).then(response => {
        const options = response.data; // Assuming the API response has data property
        setAutocompleteOptions(options);
      });
    }, 500),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchInput(value);
    if (value) {
      fetchSuggestions(value);
      setOpen(true);
    } else {
      setAutocompleteOptions(topTags);
      setOpen(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setSearchInput('');
    setOpen(false);
    setAutocompleteOptions(topTags);
  };
  
  const handleSearch = () => {
    const data = {
      tags: selectedTags,
      pageNumber: 1,
      pageSize: 10
    };
    searchImages(data).then(response => {
      const updatedResults = response.data.map((item: { key: string }) => ({
        ...item,
        key: `http://localhost:5000/${item.key}`
      }));
      setSearchResult(updatedResults);
    });
  };

  const handleTagDelete = (tagToDelete: string) => {
    setSelectedTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchInput) {
      if (!selectedTags.includes(searchInput)) {
        setSelectedTags([...selectedTags, searchInput]);
      }
      setSearchInput('');
      setAutocompleteOptions(topTags);
      setOpen(false);
    }
  };

  const handleFocus = () => {
    setAutocompleteOptions(topTags);
    setOpen(true);
  };

  const handleBlur = () => {
    // Delay closing to allow click event to register
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={5}>
    <Box width={{ xs: '90%', sm: '70%', md: '50%', lg: '33%' }} position="relative">
      <TextField
        variant="outlined"
        placeholder="Search"
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {open && (
        <Paper elevation={3} style={{ position: 'absolute', zIndex: 1, width: '100%' }}>
          <List>
            {autocompleteOptions.map((option, index) => (
              <ListItem button key={index} onMouseDown={() => handleTagSelect(option)}>
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
    <Box mt={2} width={{ xs: '90%', sm: '70%', md: '50%', lg: '33%' }}>
      <Grid container spacing={1}>
        {selectedTags.map((tag, index) => (
          <Grid item key={index}>
            <Chip label={tag} onDelete={() => handleTagDelete(tag)} />
          </Grid>
        ))}
      </Grid>
    </Box>
      <TagsContainer>
        {searchResult.map((result, index) => (
          <ImageResultContainer key={result._id}>
            <Image src={result.key} alt={`Result ${index}`} />
            <DownloadButton className="downloadIcon">
                <a href={result.key} download>
                  <DownloadIcon style={{color: 'white'}} />
                </a>
            </DownloadButton>
            <ImageLabel>Result {index + 1}</ImageLabel>
          </ImageResultContainer>
        ))}
      </TagsContainer>
      </Box>
);
};

export default TagSearch;
