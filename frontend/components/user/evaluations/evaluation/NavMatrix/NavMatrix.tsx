import * as React from 'react';
import { Table } from 'react-bootstrap';

import NavMatrixLevel from './NavMatrixLevel';

import '../../../../common/matrix.scss';
import './nav-matrix.scss';

type NavMatrixProps = {
  categories: string[],
  levels: string[],
  skillGroups: NormalizedSkillGroups,
};

const NavMatrix = ({ categories, levels, skillGroups }: NavMatrixProps) => (
  <div>
    <Table responsive className="nav_matrix__table">
      <tbody>
      {
        levels.map(levelName => (
          <NavMatrixLevel
            key={levelName}
            categories={categories}
            levelName={levelName}
            skillGroups={skillGroups}
          />
        ))
      }
      </tbody>
    </Table>
  </div>
);

export default NavMatrix;
