import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Autocomplete, Chip, Box } from '@mui/material';
import { autocompleteTags, searchImages } from '../../services/api';
import { debounce } from 'lodash';

const SearchImages: React.FC = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (tags.length > 0) {
                const response = await searchImages({ tags, pageNumber: 1, pageSize: 10 });
                setSearchResults(response.data);
            }
        };

        fetchResults();
    }, [tags]);

    useEffect(() => {
        if (!inputValue) {
            setAutocompleteOptions([]);
            return;
        }
        const fetchAutocompleteOptions = debounce(async () => {
            const response = await autocompleteTags(inputValue);
            setAutocompleteOptions(response.data);
        }, 500);

        fetchAutocompleteOptions();

        return () => {
            fetchAutocompleteOptions.cancel();
        };
    }, [inputValue]);

    // Print out new search results' keys
    useEffect(() => {
        console.log(searchResults.map((result: any) => result.key));
    }, [searchResults]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Search Images</Typography>
            <Autocomplete
                multiple
                freeSolo
                options={autocompleteOptions}
                value={tags}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                onChange={(_, newValue) => {
                    setTags(newValue);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Search by tags"
                    />
                )}
                filterOptions={(options, state) => {
                    return options.filter((option) => {
                        return state.inputValue ? option.includes(state.inputValue) : true;
                    });
                }}
            />
            <Box mt={2}>
                {searchResults.map((result: any) => (
                    <img key={result._id} src={`http://localhost:5000/${result.key}`} alt={result.key} width="200" />
                ))}
            </Box>
        </Container>
    );
};

export default SearchImages;
