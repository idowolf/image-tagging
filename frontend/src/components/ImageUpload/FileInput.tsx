import React from 'react';
import { Typography, Button } from '@mui/material';
import { FileInputDiv } from './styles';

interface FileInputProps {
    file: File | null;
}

/**
 * Renders a file input component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {File} props.file - The selected file.
 * @returns {JSX.Element} - The rendered component.
 */
const FileInput: React.FC<FileInputProps> = ({ file }) => {
    return (
        <FileInputDiv>
            <div>
                {file && <Typography variant="body1">Selected file: {file.name}</Typography>}
            </div>
        </FileInputDiv>
    );
};

export default FileInput;
