import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { ImagesSection, ImageResultContainer, DownloadButton, Image, Outer } from './styles';
interface SearchResultsProps {
    searchResult: any[];
}

/**
 * Renders the search results component.
 *
 * @component
 * @param {Object} searchResult - The array of search results.
 * @returns {JSX.Element} The search results component.
 */
const SearchResults: React.FC<SearchResultsProps> = ({ searchResult }) => {
    return (
        <>
            {searchResult && searchResult.length > 0 && (
                <Outer>
                    <ImagesSection id="scrollable-image-section">
                        {searchResult.map((result, index) => (
                            <ImageResultContainer key={result._id}>
                                <Image src={result.key} alt={`Result ${index}`} />
                                <DownloadButton className="downloadIcon">
                                    <a href={result.key} download>
                                        <DownloadIcon style={{ color: 'white' }} />
                                    </a>
                                </DownloadButton>
                            </ImageResultContainer>
                        ))}
                    </ImagesSection>
                </Outer>
            )}
        </>
    );
};

export default SearchResults;
