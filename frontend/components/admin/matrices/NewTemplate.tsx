import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, ControlLabel, Form, FormControl, FormGroup, Glyphicon, InputGroup, Panel, Row } from 'react-bootstrap';
import { actions } from '../../../modules/admin/matrices';
import SaveEntityForm from './SaveEntityForm';

type NewTemplateComponentProps = {
  actions: typeof actions,
  success: boolean,
  error: ErrorMessage,
};

const FieldGroup = ({ id, label = '', ...props }) =>
  (<FormGroup controlId={id}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <FormControl name={id} {...props} />
  </FormGroup>);

const moveItem = (arr, fromIndex, toIndex) => arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);

class NewTemplateComponent extends React.Component<NewTemplateComponentProps, { template: UnhydratedTemplate }> {
  constructor(props) {
    super(props);
    this.state = {
      template: {
        name: '',
        id: '',
        version: 1,
        categories: [],
        levels: [],
        skillGroups: [],
      },
    };
    this.updateTemplateState = this.updateTemplateState.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.moveCategoryUp = this.moveCategoryUp.bind(this);
    this.moveCategoryDown = this.moveCategoryDown.bind(this);
  }

  updateTemplateState(e) {
    const field = e.target.name;
    const template = this.state.template;
    template[field] = e.target.value;
    return this.setState({ template });
  }

  updateCategory(newValue, index) {
    const template = this.state.template;
    template.categories[index] = newValue;
    return this.setState({ template });
  }

  removeCategory(index) {
    const template = this.state.template;
    template.categories.splice(index, 1);
    return this.setState({ template });
  }

  moveCategoryUp(index) {
    const template = this.state.template;
    moveItem(template.categories, index, index - 1);
    return this.setState({ template });
  }

  moveCategoryDown(index) {
    const template = this.state.template;
    moveItem(template.categories, index, index + 1);
    return this.setState({ template });
  }

  addCategory() {
    const template = this.state.template;
    template.categories.push('');
    return this.setState({ template });
  }

  render() {
    const { template } = this.state;
    return (
      <div>
        <Row>
          <Form>
            <FieldGroup
              id="id"
              type="text"
              label="id"
              value={template.id || ''}
              onChange={this.updateTemplateState}
              placeholder="id"
            />
            <FieldGroup
              id="name"
              type="text"
              label="Name"
              value={template.name || ''}
              onChange={this.updateTemplateState}
              placeholder="name"
            />

            <Panel header={<h3>Categories</h3>}>
              {template.categories ?
                template.categories.map((c, index) =>
                  (<FormGroup controlId={`category_${index}`}>
                    <InputGroup>
                      <FormControl name={`category_${index}`}
                                   key={`category_${index}`}
                                   type="text"
                                   value={c}
                                   onChange={(e: any) => this.updateCategory(e.target.value, index)}
                                   placeholder="Category"
                      />
                      <InputGroup.Button>
                        <Button onClick={() => this.moveCategoryUp(index)}>
                          <Glyphicon glyph="arrow-up" />
                        </Button>
                      </InputGroup.Button>
                      <InputGroup.Button>
                        <Button onClick={() => this.moveCategoryDown(index)}>
                          <Glyphicon glyph="arrow-down" />
                        </Button>
                      </InputGroup.Button>
                      <InputGroup.Button>
                        <Button onClick={() => this.removeCategory(index)}>
                          <Glyphicon glyph="minus" />
                        </Button>
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>)) :
                false}
              <Button bsStyle="primary" onClick={this.addCategory}>
                <Glyphicon glyph="plus" /></Button>
            </Panel>

          </Form>
        </Row>
      </div>
    );
  }
}

export const NewTemplate = connect(
  state => state.matrices.templateAddResult || {},
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(NewTemplateComponent);
