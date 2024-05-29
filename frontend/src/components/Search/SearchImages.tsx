import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
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
