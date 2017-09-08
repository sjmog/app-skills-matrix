import * as React from 'react';
import { Button, FormControl, FormGroup, Glyphicon, InputGroup, Panel } from 'react-bootstrap';

const moveItem = (arr, fromIndex, toIndex) => arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);

const updateItem = (array, value, index) => {
  array[index] = value;
  return array;
};

const moveItemUp = (array, index) => {
  moveItem(array, index, index - 1);
  return array;
};

const moveItemDown = (array, index) => {
  moveItem(array, index, index + 1);
  return array;
};

const removeItem = (array, index) => {
  array.splice(index, 1);
  return array;
};

const addItem = (array) => {
  array.push('');
  return array;
};

type EditableListProps = {
  title: string,
  placeholder: string,
  array: string[],
  onUpdate: (array: string[]) => void,
};

const EditableList = ({ title, placeholder, array, onUpdate }: EditableListProps) => (<Panel header={<h3>{title}</h3>}>
    {array.map((c, index) =>
      (<FormGroup key={`${placeholder}_${index}`}>
        <InputGroup>
          <FormControl name={`${placeholder}_${index}`}
                       type="text"
                       value={c}
                       onChange={(e: any) => onUpdate(updateItem(array, e.target.value, index))}
                       placeholder={placeholder}
          />
          <InputGroup.Button>
            <Button onClick={() => onUpdate(moveItemUp(array, index))}>
              <Glyphicon glyph="arrow-up" />
            </Button>
          </InputGroup.Button>
          <InputGroup.Button>
            <Button onClick={() => onUpdate(moveItemDown(array, index))}>
              <Glyphicon glyph="arrow-down" />
            </Button>
          </InputGroup.Button>
          <InputGroup.Button>
            <Button onClick={() => onUpdate(removeItem(array, index))}>
              <Glyphicon glyph="minus" />
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>))}
    <Button bsStyle="primary" onClick={() => onUpdate(addItem(array))}>
      <Glyphicon glyph="plus" /></Button>
  </Panel>

);

export default EditableList;
