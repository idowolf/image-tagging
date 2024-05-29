import React, { useState, useEffect, useCallback } from 'react';
import { Chip, Grid, debounce } from '@mui/material';
import { getTopTags, autocompleteTags } from '../../routes/tags';
import { useImageSearch } from '../../hooks/useImageSearch';
import { SearchResultsContainer, TagsContainer } from './styles';
import SearchResults from './SearchResults';
import CustomAutocompleteField from './CustomAutocompleteField';

const TagSearch: React.FC = () => {
    const { searchResult, handleSearch, setPage, hasMore } = useImageSearch();
    const [topTags, setTopTags] = useState<string[]>([]);
    const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    useEffect(() => {
        (async () => {
            try {
                const response = await getTopTags();
                const tags = response.data;
                setTopTags(tags);
                setAutocompleteOptions(tags);
            } catch (error) {
                console.error('Failed to fetch top tags', error);
            }
        })();
    }, []);

    useEffect(() => {
        if (selectedTags.size > 0) {
            handleSearch(selectedTags);
        }
    }, [selectedTags]);

    const fetchSuggestions = useCallback(
        debounce(async (input: string) => {
            try {
                const response = await autocompleteTags(input);
                const options = response.data;
                setAutocompleteOptions(options);
            } catch (error) {
                console.error('Autocomplete failed', error);
            }
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
        const newSelectedTags = new Set(selectedTags);
        newSelectedTags.delete(tagToDelete);
        setSelectedTags(newSelectedTags);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchInput) {
            if (!selectedTags.has(searchInput) && autocompleteOptions.includes(searchInput)) {
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
            <CustomAutocompleteField
                value={searchInput}
                onChange={handleInputChange}
                handleKeyDown={handleKeyDown}
                showIcon={false}
                placeholder={'Type to find tags...'}
                open={open}
                setOpen={setOpen}
                onSearchClick={() => handleSearch(selectedTags)}
                autocompleteOptions={autocompleteOptions}
                onOptionSelected={handleTagSelect}
            />
            {selectedTags.size > 0 && <TagsContainer>
                <Grid container spacing={1}>
                    {Array.from(selectedTags).map((tag, index) => (
                        <Grid item key={index}>
                            <Chip label={tag} onDelete={() => handleTagDelete(tag)} />
                        </Grid>
                    ))}
                </Grid>
            </TagsContainer>}
            <SearchResults searchResult={searchResult} handleSearch={handleSearch} setPage={setPage} hasMore={hasMore} />
        </SearchResultsContainer>
    );
};

export default TagSearch;
