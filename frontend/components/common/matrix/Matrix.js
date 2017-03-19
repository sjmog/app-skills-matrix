import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';

import Level from './Level';

import '../../common/matrix/matrix.scss'

const Matrix = ({ categories, levels, skillGroups, skills }) =>
  (
    <Table responsive>
      <thead className='matrix-table__head'>
        <tr>
          <th>Level</th>
          { categories.map((categoryName) => (<th key={categoryName}>{categoryName}</th>)) }
        </tr>
      </thead>
      <tbody className='matrix-table__body'>
      {
        levels.map((levelName) => (
          <Level
            key={levelName}
            categories={categories}
            levelName={levelName}
            skillGroups={skillGroups}
            skills={skills}
          />
        ))
      }
      </tbody>
    </Table>
  );

Matrix.propTypes = {
  categories: PropTypes.array.isRequired,
  levels: PropTypes.array.isRequired,
  skillGroups: PropTypes.object.isRequired,
  skills: PropTypes.object.isRequired,
};

export default Matrix;
