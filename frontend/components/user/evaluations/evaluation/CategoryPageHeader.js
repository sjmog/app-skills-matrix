import React, { PropTypes } from 'react';
import { PageHeader, ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

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
    const { evaluationId,
      currentCategory,
      templateName,
      remainingCategories,
      isFirstCategory,
      isLastCategory,
      previousCategory,
      nextCategory,
      } = this.props;

    const { isLoading } = this.state;

    return (
      <PageHeader>
        {templateName}
        {' '}
        <small>{currentCategory}</small>
        <ButtonToolbar className='pull-right'>
          <ButtonGroup>
            <Link to={`evaluations/${evaluationId}/category/${previousCategory}`} className={'category-nav-link'}>
              <Button className='nav-btn--left' bsSize='large' disabled={isFirstCategory}>
                <Glyphicon glyph='chevron-left'/>
                Previous category
              </Button>
            </Link>
            <Link to={`evaluations/${evaluationId}/category/${nextCategory}`} className={'category-nav-link'}>
              <Button className='nav-btn--right' bsSize='large' disabled={isLastCategory}>
                {`Next category (${remainingCategories} remaining)`}
                <Glyphicon glyph='chevron-right'/>
              </Button>
            </Link>
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
    templateName: PropTypes.string.isRequired,
    remainingCategories: PropTypes.number.isRequired,
    isFirstCategory: PropTypes.bool.isRequired,
    isLastCategory: PropTypes.bool.isRequired,
    previousCategory: PropTypes.string,
    nextCategory: PropTypes.string,
    evaluationComplete: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

export default CategoryPageHeader;