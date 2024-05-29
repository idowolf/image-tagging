import styled from 'styled-components';
import { Box, Paper } from '@mui/material';

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
  margin-top: 3rem;
`;

export const TagsContainer = styled(Box)`
  margin-top: 2rem;
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