import React, { useState, useEffect, useCallback } from 'react';
import { Chip, Grid, debounce } from '@mui/material';
import { getTopTags, autocompleteTags } from '../../routes/tags';
import { useImageSearch } from '../../hooks/useImageSearch';
import { SearchResultsContainer, TagsContainer } from './styles';
import SearchResults from './SearchResults';
import CustomAutocompleteField from './CustomAutocompleteField';

/**
 * Component for searching images by tags.
 */
const TagSearch: React.FC = () => {
    const { searchResult, handleSearch } = useImageSearch();
    const [topTags, setTopTags] = useState<string[]>([]);
    const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    /**
     * Fetches the top tags from the server and sets the state.
     */
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

    /**
     * Handles the search when the selected tags change.
     */
    useEffect(() => {
        if (selectedTags.size > 0) {
            handleSearch({ tags: selectedTags, pageNumber: 1 });
        } else {
            handleSearch({ tags: new Set(), pageNumber: 1 });
        }
    }, [selectedTags]);

    /**
     * Fetches tag suggestions based on the input value.
     */
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

    /**
     * Handles the input change event.
     */
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

    /**
     * Handles the selection of a tag.
     */
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

    /**
     * Handles the deletion of a tag.
     */
    const handleTagDelete = (tagToDelete: string) => {
        const newSelectedTags = new Set(selectedTags);
        newSelectedTags.delete(tagToDelete);
        setSelectedTags(newSelectedTags);
    };

    /**
     * Handles the key down event.
     */
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
                onSearchClick={() => {}}
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
            <SearchResults searchResult={searchResult} />
        </SearchResultsContainer>
    );
};

export default TagSearch;
