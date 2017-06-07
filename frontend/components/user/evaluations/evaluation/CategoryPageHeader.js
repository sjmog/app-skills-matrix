import React, { PropTypes } from 'react';
import { PageHeader, ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import '../evaluation.scss'

class CategoryPageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
    this.handleEvalCompleteClick = this.handleEvalCompleteClick.bind(this);
  }

  handleEvalCompleteClick() {
    const { evaluationComplete, router, evaluationId } = this.props;

    this.setState({ isLoading: true });
    evaluationComplete(evaluationId);
    setTimeout(() => router.push(`evaluations/${evaluationId}`), 2000);
  }

  render() {
    const {
      currentCategory,
      isFirstCategory,
      isLastCategory,
      previousCategory,
      nextCategory,
      } = this.props;

    const { isLoading } = this.state;

    return (
      <PageHeader>
        {currentCategory}
        <ButtonToolbar className='pull-right'>
          <ButtonGroup>
            <Button
              className='nav-btn--left'
              bsSize='large'
              onClick={() => previousCategory()}
              disabled={isFirstCategory}
            >
              <Glyphicon glyph='chevron-left'/>
              Previous category
            </Button>
            <Button
              className='nav-btn--right'
              bsSize='large'
              disabled={isLastCategory}
              onClick={() => nextCategory()}
            >
              Next category
              <Glyphicon glyph='chevron-right'/>
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

CategoryPageHeader.propTypes = {
  evaluationId: PropTypes.string.isRequired,
  currentCategory: PropTypes.string.isRequired,
  isFirstCategory: PropTypes.bool.isRequired,
  isLastCategory: PropTypes.bool.isRequired,
  previousCategory: PropTypes.func.isRequired,
  nextCategory: PropTypes.func.isRequired,
  evaluationComplete: PropTypes.func.isRequired,
};

export default CategoryPageHeader;