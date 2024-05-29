import React, {  } from 'react';
import { TextField, IconButton, InputAdornment, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchContainer, AutocompletePaper, SearchIconPadding } from './styles';

interface CustomAutocompleteFieldProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder: string;
    showIcon?: boolean;
    open: boolean;
    setOpen: (open: boolean) => void;
    onSearchClick: () => void;
    autocompleteOptions: string[];
    onOptionSelected: (option: string) => void;
}

/**
 * CustomAutocompleteField component.
 * 
 * @param value - The current value of the autocomplete field.
 * @param onChange - The callback function to handle value changes.
 * @param handleKeyDown - The callback function to handle keydown events.
 * @param showIcon - Determines whether to show the search icon.
 * @param placeholder - The placeholder text for the autocomplete field.
 * @param setOpen - The callback function to handle opening/closing of the autocomplete options.
 * @param open - Determines whether the autocomplete options are open.
 * @param onSearchClick - The callback function to handle search button click.
 * @param autocompleteOptions - The array of autocomplete options.
 * @param onOptionSelected - The callback function to handle selection of an autocomplete option.
 */
const CustomAutocompleteField: React.FC<CustomAutocompleteFieldProps> = ({ value, onChange, handleKeyDown, showIcon = true, placeholder, setOpen, open, onSearchClick, autocompleteOptions, onOptionSelected }) => {
    return (
            <SearchContainer>
                <TextField
                    variant="outlined"
                    placeholder={placeholder}
                    fullWidth
                    value={value}
                    autoComplete='off'
                    style={{ padding: '0' }}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 100)}
                    InputProps={{
                        style: SearchIconPadding,
                        endAdornment: (
                            <InputAdornment position="end">
                                {showIcon && <IconButton onClick={onSearchClick}>
                                    <SearchIcon color="primary" />
                                </IconButton>}
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
