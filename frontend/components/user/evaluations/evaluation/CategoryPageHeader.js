import React, { PropTypes } from 'react';
import { PageHeader, ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

import '../evaluation.scss'

const CategoryPageHeader = ({
  evaluationId,
  currentCategory,
  templateName,
  isFirstCategory,
  isLastCategory,
  previousCategory,
  nextCategory,
  evaluationComplete
  }) => (
  <PageHeader>
    {templateName}
    {' '}
    <small>{currentCategory}</small>
    <ButtonToolbar className='pull-right'>
      <ButtonGroup>
        <Button bsSize='large' disabled={isFirstCategory}>
          <Link to={`evaluations/${evaluationId}/category/${previousCategory}`} className={'category-nav-link'}>
            <Glyphicon glyph='chevron-left'/>
            Previous category
          </Link>
        </Button>
        <Button bsSize='large' disabled={isLastCategory}>
          <Link to={`evaluations/${evaluationId}/category/${nextCategory}`} className={'category-nav-link'}>
            Next category
            <Glyphicon glyph='chevron-right'/>
          </Link>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Link to={`evaluations/${evaluationId}`}>
          <Button
            bsStyle='primary'
            bsSize='large'
            className='pull-right'
            onClick={() => evaluationComplete(evaluationId)}>
            Evaluation complete
          </Button>
        </Link>
      </ButtonGroup>
    </ButtonToolbar>
  </PageHeader>
);

CategoryPageHeader.propTypes = {
  evaluationId: PropTypes.string.isRequired,
  currentCategory: PropTypes.string.isRequired,
  templateName: PropTypes.string.isRequired,
  isFirstCategory: PropTypes.bool.isRequired,
  isLastCategory: PropTypes.bool.isRequired,
  previousCategory: PropTypes.string,
  nextCategory: PropTypes.string,
  evaluationComplete: PropTypes.func.isRequired,
};

export default CategoryPageHeader;