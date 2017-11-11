import * as React from 'react';
import { connect } from 'react-redux';
import * as bootstrap from 'react-bootstrap';
import * as keymirror from 'keymirror';

const { Panel, ToggleButtonGroup, ToggleButton } = bootstrap as any; /* toggle components aren't in the type definition */

import { SaveTemplate } from './SaveTemplate';
import { SaveSkill } from './SaveSkill';
import { NewTemplate } from './NewTemplate';

import './matrices-actions.scss';

const panels = keymirror({
  NEW_TEMPLATE: null,
  IMPORT_SKILLS: null,
  IMPORT_TEMPLATE: null,
});

class MatricesActions extends React.Component<any> {
  constructor(props) {
    super(props);

    this.state = {
      openPanel: panels.NEW_TEMPLATE,
    };
  }

  render() {
    const { openPanel } = this.state as any;

    return (
      <div>
        <ToggleButtonGroup justified type="radio" name="options" defaultValue={1} className="matrices-actions__btn-toolbar">
          <ToggleButton
            bsStyle="primary"
            className="matrices-actions__btn matrices-actions__btn-toolbar--left"
            value={1}
            onClick={() => this.setState({ openPanel: panels.NEW_TEMPLATE })}
          >
            New template
          </ToggleButton>
          <ToggleButton
            bsStyle="primary"
            className="matrices-actions__btn"
            value={2}
            onClick={() => this.setState({ openPanel: panels.IMPORT_SKILLS })}
          >
            Import skills
          </ToggleButton>
          <ToggleButton
            bsStyle="primary"
            className="matrices-actions__btn matrices-actions__btn-toolbar--right"
            value={3}
            onClick={() => this.setState({ openPanel: panels.IMPORT_TEMPLATE })}
          >
            Import template
          </ToggleButton>
        </ToggleButtonGroup>
        <Panel className="matrices-actions__panel">
          {openPanel === panels.NEW_TEMPLATE ? <NewTemplate/> : null}
          {openPanel === panels.IMPORT_SKILLS ? <SaveSkill/> : null}
          {openPanel === panels.IMPORT_TEMPLATE ? <SaveTemplate/> : null}
        </Panel>
      </div>
    );
  }
}

export default MatricesActions;
