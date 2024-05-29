import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';

const ImagesSection = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const ImageResultContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 10px;
  overflow: hidden;
  display: inline-block;

  &:hover .downloadIcon {
    display: block;
  }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px; // Add this line to round the corners
`;

const DownloadButton = styled(IconButton)`
  && {
    position: absolute;
    top: 5px;
    right: 5px;
    display: none;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 5px;
  }
`;

const ImageLabel = styled.div`
  text-align: center;
  margin-top: 5px;
`;

interface SearchResultsProps {
    searchResult: any[];
    handleSearch: () => void;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    hasMore: boolean;
}

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
