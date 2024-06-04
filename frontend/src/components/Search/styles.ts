import styled from 'styled-components';
import { Box, IconButton, Paper } from '@mui/material';

export const SearchContainer = styled(Box)`
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

export const AutocompletePaper = styled(Paper)`
  position: absolute;
  z-index: 1;
  width: 100%;
`;

export const SearchResultsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

export const TagsContainer = styled(Box)`
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

export const SearchIconPadding =  { padding: '4px 14px 4px 4px', height: '46px', };

export const ImagesSection = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex: 1;
  align-content: start;
  flex-wrap: wrap;
`;
export const Outer = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  flex-wrap: wrap;
`;

export const ImageResultContainer = styled.div`
  position: relative;
  width: 130px;
  height: 130px;
  margin: 10px;
  display: inline-block;

  &:hover .downloadIcon {
    display: block;
  }
`;

export const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
`;

export const DownloadButton = styled(IconButton)`
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