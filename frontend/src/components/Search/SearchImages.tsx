import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Autocomplete, Chip, Box } from '@mui/material';
import { autocompleteTags, searchImages } from '../../services/api';
import { debounce } from 'lodash';
import FreeformSearch from './FreeformSearch';
import SearchSelector from './SearchSelector';
import TagSearch from './TagSearch';

const SearchImages: React.FC = () => {
    const [searchType, setSearchType] = useState<'tags' | 'freeform'>('tags');

    return (
        <Container>
            <Box textAlign="center" mt={5}>
                <SearchSelector searchType={searchType} setSearchType={setSearchType} />
                {searchType === 'tags' ? <TagSearch /> : <FreeformSearch />}
            </Box>
        </Container>
    );
};

export default SearchImages;
