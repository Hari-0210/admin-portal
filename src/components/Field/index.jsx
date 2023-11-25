import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  AutocompleteField,
  AutocompleteMultipleField,
  CheckboxField,
  DatePickerField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  Textfield,
} from '../../utils/formLib';

const field = {
  text: Textfield,
  select: SelectField,
  radio: RadioGroupField,
  checkbox: CheckboxField,
  autoComplete: AutocompleteField,
  textarea: TextAreaField,
  multiselect: AutocompleteMultipleField,
  date: DatePickerField,
};
function Fields(props) {
  const { fields, formControl, index, isEdit } = props;
  const { errors, control } = formControl;
  const Component = field[fields.type];
  if (!fields.type) {
    return null;
  }
  return (
    <Controller
      name={fields.name}
      control={control}
      rules={{ required: fields.required, pattern: fields.pattern }}
      render={({ field }) => (
        <Component
          {...field}
          key={index}
          label={fields.label}
          variant={fields.variant}
          options={fields.options}
          {...(fields.value !== undefined && !isEdit ? { value: fields.value } : {})}
          error={!!errors[fields.name]}
          onChange={(e, params) => {
            if (fields.type === 'multiselect' || fields.type === 'autoComplete') {
              field.onChange(params);
            } else {
              field.onChange(e);
            }
          }}
          helperText={
            errors[fields.name]
              ? errors[fields.name].type === 'required'
                ? 'This field is required'
                : errors[fields.name].message
              : ''
          }
        />
      )}
    />
  );
}
Fields.propTypes = {
  fields: PropTypes.object.isRequired,
  formControl: PropTypes.object.isRequired,
  index: PropTypes.number,
  isEdit: PropTypes.bool,
};

export default Fields;
