import React, { PropTypes } from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router';

import './../evaluation.scss';

const CategoryNav = ({ categories, currentCategory, evaluation, evaluationComplete }) =>
  (
    <ButtonToolbar>
        {
          categories.map((category) =>
            <ButtonGroup key={category}>
              <Link to={`evaluations/${evaluation}/category/${category}`} className={'category-nav-link'}>
                <Button active={category === currentCategory}>
                  {category}
                </Button>
              </Link>
            </ButtonGroup>)
        }
      <ButtonGroup>
        <Link to={`evaluations/${evaluation}`} >
          <Button
            bsStyle='success'
            onClick={() => evaluationComplete(evaluation) }>
            {"I've finished my evaluation"}
          </Button>
        </Link>
      </ButtonGroup>
    </ButtonToolbar>
  );

CategoryNav.propTypes = {
  categories: PropTypes.array.isRequired,
  currentCategory: PropTypes.string.isRequired,
  evaluation: PropTypes.string.isRequired,
  evaluationComplete: PropTypes.func.isRequired,
};

export default CategoryNav;
