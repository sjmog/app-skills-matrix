import * as React from 'react';
import { FormControl } from 'react-bootstrap';

type SelectProps = {
  placeholder?: string,
  value: string,
  options: { value, label }[],
  handleChange: (e: any) => void,
};

const Select = ({ placeholder, value, options, handleChange }: SelectProps) => (
  <FormControl
    componentClass="select"
    placeholder={placeholder}
    value={value}
    onChange={e => handleChange(e)}
  >
    <option disabled value="default">Select...</option>
    {options.map(({ value, label }) => <option key={label} value={value}>{label}</option>)}
  </FormControl>
);

export default Select;
