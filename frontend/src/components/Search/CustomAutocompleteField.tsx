import React, {  } from 'react';
import { TextField, IconButton, InputAdornment, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchContainer, AutocompletePaper, SearchIconPadding } from './styles';

interface CustomAutocompleteFieldProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    onSearchClick: () => void;
    autocompleteOptions: string[];
    onOptionSelected: (option: string) => void;
}

const CustomAutocompleteField: React.FC<CustomAutocompleteFieldProps> = ({ value, onChange, handleKeyDown, placeholder, setOpen, open, onSearchClick, autocompleteOptions, onOptionSelected }) => {
    return (
            <SearchContainer>
                <TextField
                    variant="outlined"
                    placeholder={placeholder}
                    fullWidth
                    value={value}
                    style={{ padding: '0' }}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 100)}
                    InputProps={{
                        style: SearchIconPadding,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={onSearchClick}>
                                    <SearchIcon color="primary" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {open && (
                    <AutocompletePaper>
                        <List>
                            {autocompleteOptions.map((option, index) => (
                                <ListItem key={index} onMouseDown={() => onOptionSelected(option)}>
                                    <ListItemText primary={option} />
                                </ListItem>
                            ))}
                        </List>
                    </AutocompletePaper>
                )}
            </SearchContainer>
    );
};

export default CustomAutocompleteField;
