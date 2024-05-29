import React, { useState } from 'react';
import { Box } from '@mui/material';
import FreeformSearch from './FreeformSearch';
import SearchSelector from './SearchSelector';
import TagSearch from './TagSearch';

/**
 * Renders the search images component.
 * @returns The search images component.
 */
const SearchImages: React.FC = () => {
    const [searchType, setSearchType] = useState<'tags' | 'freeform'>('tags');

    return (
            <Box textAlign="center" mt={5} style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: 'auto', justifyContent: 'center', gridGap: '20px' }}>
                <SearchSelector searchType={searchType} setSearchType={setSearchType} />
                {searchType === 'tags' ? <TagSearch /> : <FreeformSearch />}
            </Box>
    );
};

export default SearchImages;
