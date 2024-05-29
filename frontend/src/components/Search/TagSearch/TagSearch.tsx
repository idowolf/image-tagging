import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Chip, Grid, IconButton, InputAdornment, Paper, List, ListItem, ListItemText, debounce } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getTopTags, autocompleteTags, searchImages } from '../../../services/api'; // Updated import path
import styled from 'styled-components';
import SearchResults from '../SearchResults';


const TagSearchContainer = styled(Box)`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin-top: 5rem;
`;

const SearchContainer = styled(Box)`
position: relative;
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

const AutocompletePaper = styled(Paper)`
position: absolute;
z-index: 1;
width: 100%;
`;

const TagSearch: React.FC = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [topTags, setTopTags] = useState<string[]>([]);
    const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

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

    const handleSearch = (newSearch: boolean = true) => {
        const data = {
            tags: selectedTags,
            pageNumber: newSearch ? 1 : page,
            pageSize: 10
        };
        searchImages(data).then(response => {
            const updatedResults = response.data.map((item: { key: string }) => ({
                ...item,
                key: `http://localhost:5000/${item.key}`
            }));
            if (newSearch) {
                setSearchResult(updatedResults);
            } else {
                setSearchResult(prevResults => [...prevResults, ...updatedResults]);
            }
            setHasMore(response.data.length > 0);
        });
        if (newSearch) setPage(2); // Reset to page 2 after a new search
    };

    useEffect(() => {
        const handleScroll = (event: any) => {
            const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
            if (bottom && hasMore) {
                handleSearch(false);
                setPage(prevPage => prevPage + 1);
            }
        };

        const scrollContainer = document.getElementById('scrollable-image-section');
        scrollContainer?.addEventListener('scroll', handleScroll);
        return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    const handleTagSelect = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setSearchInput('');
        setOpen(false);
        setAutocompleteOptions(topTags);
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
        <TagSearchContainer>
            <SearchContainer>
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
                                <IconButton onClick={() => handleSearch()}>
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
                                <ListItem button key={index} onMouseDown={() => handleTagSelect(option)}>
                                    <ListItemText primary={option} />
                                </ListItem>
                            ))}
                        </List>
                    </AutocompletePaper>
                )}
            </SearchContainer>
            <Box mt={2} width={{ xs: '90%', sm: '70%', md: '50%', lg: '33%' }}>
                <Grid container spacing={1}>
                    {selectedTags.map((tag, index) => (
                        <Grid item key={index}>
                            <Chip label={tag} onDelete={() => handleTagDelete(tag)} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <SearchResults selectedTags={selectedTags} searchResult={searchResult} handleSearch={handleSearch} setPage={setPage} hasMore={hasMore} />
        </TagSearchContainer>
    );
};

export default TagSearch;
