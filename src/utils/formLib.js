import React from 'react';
import {
  TextField,
  Select,
  Autocomplete,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  width: -webkit-fill-available;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

// Text Field
const Textfield = React.forwardRef(({ label, error, required, helperText, ...props }, ref) => (
  <TextField
    fullWidth
    autoComplete="off"
    inputRef={ref}
    label={label}
    inputMode={props.inputMode}
    error={error}
    required={required}
    helperText={helperText}
    {...props}
  />
));

Textfield.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  inputMode: PropTypes.string,
  helperText: PropTypes.string,
};

// Select
const SelectField = React.forwardRef(({ label, error, required, helperText, options, ...props }, ref) => (
  <FormControl fullWidth error={error}>
    <InputLabel id="demo-simple-select-label">{label}</InputLabel>
    <Select fullWidth inputRef={ref} label={label} error={error} required={required} {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    <FormHelperText>{helperText}</FormHelperText>
  </FormControl>
));

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Autocomplete
const AutocompleteField = React.forwardRef(({ label, error, required, helperText, options, ...props }, ref) => (
  <Autocomplete
    inputRef={ref}
    options={options}
    getOptionLabel={(option) => option.label}
    renderInput={(params) => (
      <TextField {...params} label={label} error={error} required={required} helperText={helperText} />
    )}
    {...props}
  />
));

AutocompleteField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Checkbox
const CheckboxField = React.forwardRef(({ label, error, required, helperText, ...props }, ref) => (
  <Checkbox inputRef={ref} label={label} error={error} required={required} helperText={helperText} {...props} />
));

CheckboxField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
};

// Radio Group
const RadioGroupField = React.forwardRef(({ label, error, required, helperText, options, ...props }, ref) => (
  <FormControl error={error}>
    <FormLabel>{label}</FormLabel>
    <RadioGroup
      row
      inputRef={ref}
      aria-label={label}
      name={label}
      error={error}
      required={required}
      helperText={helperText}
      {...props}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio color="primary" size="small" />}
          label={option.label}
        />
      ))}
    </RadioGroup>
    <FormHelperText>{helperText}</FormHelperText>
  </FormControl>
));

RadioGroupField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Textarea
const TextAreaField = React.forwardRef(({ label, error, required, helperText, ...props }, ref) => (
  <FormControl fullWidth error={error}>
    <TextareaAutosize
      maxRows={4}
      minRows={4}
      ref={ref}
      placeholder={label}
      required={required}
      {...props}
      style={{
        borderColor: error ? 'red' : 'initial',
      }}
    />
    <FormHelperText>{helperText}</FormHelperText>
  </FormControl>
));

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
};

// Autocomplete
const AutocompleteMultipleField = React.forwardRef(({ label, error, required, helperText, options, ...props }, ref) => (
  <Autocomplete
    multiple
    inputRef={ref}
    options={options}
    disableCloseOnSelect
    limitTags={1}
    value={undefined}
    getOptionLabel={(option) => option.label}
    renderOption={(props, option, { selected }) => (
      <li {...props}>
        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
        {option.label}
      </li>
    )}
    renderInput={(params) => (
      <TextField {...params} label={label} error={error} required={required} helperText={helperText} />
    )}
    {...props}
  />
));

AutocompleteMultipleField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const DatePickerField = React.forwardRef(({ label, error, helperText, ...props }, ref) => (
  <FormControl fullWidth error={error}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        onChange={props.onChange}
        inputRef={ref}
        label={label}
        format="DD/MM/YYYY"
        defaultValue={props.value ? dayjs(props.value) : undefined}
      />
    </LocalizationProvider>
    <FormHelperText>{helperText}</FormHelperText>
  </FormControl>
));

DatePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  onChange: PropTypes.any,
  value: PropTypes.any,
};

export {
  Textfield,
  SelectField,
  AutocompleteField,
  CheckboxField,
  RadioGroupField,
  TextAreaField,
  AutocompleteMultipleField,
  DatePickerField,
};
