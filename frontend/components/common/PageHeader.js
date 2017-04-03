import React, { PropTypes } from 'react';
import { Alert, PageHeader, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import './page-header.scss'

const Header = ({ title, alertText, subTitle, btnUrl, btnOnClick, btnDisabled, btnText }) => (
  <div>
    { alertText ? <Alert bsStyle='info'>{alertText}</Alert> : false }
    <PageHeader>{title}{' '}<small>{subTitle}</small>
      {
        btnUrl
          ? <Link to={btnUrl}>
              <Button
                disabled={btnDisabled}
                bsStyle='primary'
                bsSize='large'
                className='pull-right'>
                {btnText}
              </Button>
            </Link>
          : false
      }
      {
        btnOnClick
          ? <Button
              disabled={btnDisabled}
              bsStyle='primary'
              bsSize='large'
              className='pull-right'
              onClick={() => btnOnClick()}>
              {btnText}
            </Button>
          : false
      }
    </PageHeader>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  btnUrl: PropTypes.string,
  btnDisabled: PropTypes.bool,
  btnText: PropTypes.string.isRequired,
  btnOnClick: PropTypes.func,
};

export default Header;
