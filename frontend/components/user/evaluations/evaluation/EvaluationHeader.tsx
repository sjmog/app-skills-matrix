import * as React from 'react';
import { PageHeader, ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import '../evaluation.scss';

type CategoryPageHeaderProps = {
  evaluationId: string,
  currentCategory: string,
  isFirstCategory: boolean,
  isLastCategory: boolean,
  previousCategory: () => void,
  nextCategory: () => void,
  evaluationComplete: (evaluationId: string) => void,
};

class CategoryPageHeader extends React.Component<CategoryPageHeaderProps, any> {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
    this.handleEvalCompleteClick = this.handleEvalCompleteClick.bind(this);
  }

  handleEvalCompleteClick() {
    const { evaluationComplete, evaluationId } = this.props;

    this.setState({ isLoading: true });
    setTimeout(() => evaluationComplete(evaluationId), 1000);
  }

  render() {
    const { currentCategory, isFirstCategory, isLastCategory, previousCategory, nextCategory } = this.props;
    const { isLoading } = this.state;

    return (
      <PageHeader>
        {currentCategory}
        <ButtonToolbar className="pull-right">
          <ButtonGroup>
            <Button
              className="nav-btn--left"
              bsSize="large"
              onClick={() => previousCategory()}
              disabled={isFirstCategory}
            >
              <Glyphicon glyph="chevron-left" />
              Previous category
            </Button>
            <Button
              className="nav-btn--right"
              bsSize="large"
              disabled={isLastCategory}
              onClick={() => nextCategory()}
            >
              Next category
              <Glyphicon glyph="chevron-right" />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              bsStyle="primary"
              bsSize="large"
              disabled={isLoading}
              onClick={!isLoading ? this.handleEvalCompleteClick : null}
            >
              Evaluation complete
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </PageHeader>
    );
  }
}

export default CategoryPageHeader;
