import * as React from 'react';
import { Alert, PageHeader, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import './page-header.scss';

type HeaderProp = {
  title: string,
  subTitle?: string,
  alert?: string | object,
  btnUrl?: string,
  btnDisabled?: boolean,
  btnText?: string,
  btnOnClick?: () => void,
  alertStyle?: string,
};

const Header = ({ title, alert, subTitle, btnUrl, btnOnClick, btnDisabled, btnText, alertStyle }: HeaderProp) => {
  if (!title) return null;

  return (
    <div>
      { alert ? <Alert bsStyle={alertStyle || 'info'}>{alert}</Alert> : false }
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
};



export default Header;
