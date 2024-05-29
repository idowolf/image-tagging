import React, { useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { ImagesSection, ImageResultContainer, DownloadButton, ImageLabel, Image } from './styles';
interface SearchResultsProps {
    searchResult: any[];
    handleSearch: () => void;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    hasMore: boolean;
}

/**
 * Renders the search results component.
 *
 * @component
 * @param {Object} searchResult - The array of search results.
 * @param {Function} handleSearch - The function to handle search.
 * @param {Function} setPage - The function to set the current page.
 * @param {boolean} hasMore - Indicates if there are more search results available.
 * @returns {JSX.Element} The search results component.
 */
const SearchResults: React.FC<SearchResultsProps> = ({ searchResult, handleSearch, setPage, hasMore }) => {
    useEffect(() => {
        const handleScroll = (event: any) => {
            const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
            if (bottom && hasMore) {
                handleSearch();
                setPage(prevPage => prevPage + 1);
            }
        };

        const scrollContainer = document.getElementById('scrollable-image-section');
        scrollContainer?.addEventListener('scroll', handleScroll);
        return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    return (
        <ImagesSection id="scrollable-image-section" style={{ height: '100%', overflowY: 'auto' }}>
            {searchResult.map((result, index) => (
                <ImageResultContainer key={result._id}>
                    <Image src={result.key} alt={`Result ${index}`} />
                    <DownloadButton className="downloadIcon">
                        <a href={result.key} download>
                            <DownloadIcon style={{ color: 'white' }} />
                        </a>
                    </DownloadButton>
                    <ImageLabel>Result {index + 1}</ImageLabel>
                </ImageResultContainer>
            ))}
        </ImagesSection>
    );
};

export default SearchResults;
