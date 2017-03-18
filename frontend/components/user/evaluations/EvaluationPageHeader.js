import React, { PropTypes } from 'react';
import { Row, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import { EVALUATION_STATUS } from '../../../modules/user/evaluation';
import Matrix from '../../common/matrix/Matrix';
import './evaluation.scss'

const EvaluationPageHeader = ({ templateName, firstCategory, id, status} ) => (
  <Row>
    <h3 className='header'>{templateName}</h3>
    {
      status === EVALUATION_STATUS.NEW
        ? <Link to={`evaluations/${id}/category/${firstCategory}`}>
            <Button bsStyle='primary' className='header__button'>
              Begin evaluation
            </Button>
          </Link>
        : false
    }
  </Row>
);

EvaluationPageHeader.propTypes = {
  templateName: PropTypes.string.isRequired,
  firstCategory: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default EvaluationPageHeader;
