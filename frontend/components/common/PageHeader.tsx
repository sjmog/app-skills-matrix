import * as React from 'react';
import { Alert, PageHeader, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import './page-header.scss';

type HeaderProp = {
  title: string,
  subTitle?: string,
  alertText?: string,
  btnUrl?: string,
  btnDisabled?: boolean,
  btnText?: string,
  btnOnClick?: () => void,
};

const Header = ({ title, alertText, subTitle, btnUrl, btnOnClick, btnDisabled, btnText }: HeaderProp) => (
  <div>
    { alertText ? <Alert bsStyle="info">{alertText}</Alert> : false }
    <PageHeader>{title}{' '}<small>{subTitle}</small>
      {
        btnUrl
          ? <Link to={btnUrl}>
            <Button
              disabled={btnDisabled}
              bsStyle="primary"
              bsSize="large"
              className="pull-right"
            >
              {btnText}
            </Button>
          </Link>
          : false
      }
      {
        btnOnClick
          ? <Button
            disabled={btnDisabled}
            bsStyle="primary"
            bsSize="large"
            className="pull-right"
            onClick={() => btnOnClick()}
          >
            {btnText}
          </Button>
          : false
      }
    </PageHeader>
  </div>
);



export default Header;
