// src/components/TagSearch.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Chip, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, debounce } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getTopTags, autocompleteTags } from '../../services/api';
import { useImageSearch } from '../../hooks/useImageSearch';
import { SearchContainer, AutocompletePaper, SearchResultsContainer, TagsContainer, SearchIconPadding } from './styles';
import SearchResults from './SearchResults';

const TagSearch: React.FC = () => {
    const { searchResult, handleSearch, setPage, hasMore, selectedTags, setSelectedTags } = useImageSearch();
    const [topTags, setTopTags] = useState<string[]>([]);
    const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        getTopTags().then(response => {
            const tags = response.data;
            setTopTags(tags);
            setAutocompleteOptions(tags);
        });
    }, []);

    const fetchSuggestions = useCallback(
        debounce((input: string) => {
            autocompleteTags(input).then(response => {
                const options = response.data;
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
        if (!selectedTags.has(tag)) {
            const newSelectedTags = new Set(selectedTags);
            newSelectedTags.add(tag);
            setSelectedTags(newSelectedTags);
        }
        setSearchInput('');
        setOpen(false);
        setAutocompleteOptions(topTags);
    };

    const handleTagDelete = (tagToDelete: string) => {
        // Set selected tags to the same set without tagToDelete
        const newSelectedTags = new Set(selectedTags);
        newSelectedTags.delete(tagToDelete);
        setSelectedTags(newSelectedTags);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchInput) {
            if (!selectedTags.has(searchInput)) {
                const newSelectedTags = new Set(selectedTags);
                newSelectedTags.add(searchInput);
                setSelectedTags(newSelectedTags);
            }
            setSearchInput('');
            setAutocompleteOptions(topTags);
            setOpen(false);
        }
    };

    return (
        <SearchResultsContainer>
            <SearchContainer>
                <TextField
                    variant="outlined"
                    placeholder="Type to find tags..."
                    fullWidth
                    value={searchInput}
                    style={{ padding: '0'}}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 100)}
                    InputProps={{
                        style: SearchIconPadding,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => handleSearch(selectedTags)}>
                                    <SearchIcon color="primary" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {open && (
                    <AutocompletePaper>
                        <List>
                            {autocompleteOptions.map((option, index) => (
                                <ListItem key={index} onMouseDown={() => handleTagSelect(option)}>
                                    <ListItemText primary={option} />
                                </ListItem>
                            ))}
                        </List>
                    </AutocompletePaper>
                )}
            </SearchContainer>
            <TagsContainer>
                <Grid container spacing={1}>
                    {[...selectedTags].map((tag, index) => (
                        <Grid item key={index}>
                            <Chip label={tag} onDelete={() => handleTagDelete(tag)} />
                        </Grid>
                    ))}
                </Grid>
            </TagsContainer>
            <SearchResults searchResult={searchResult} handleSearch={handleSearch} setPage={setPage} hasMore={hasMore} />
        </SearchResultsContainer>
    );
};

export default TagSearch;
