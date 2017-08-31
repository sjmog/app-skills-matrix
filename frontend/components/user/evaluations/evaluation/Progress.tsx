import * as React from 'react';
import { Table } from 'react-bootstrap';

import Level from './Level';

import '../../../common/matrix.scss';
import './progress.scss';

type ProgressProps = { // TODO: fix this
  categories: string[],
  levels: string[],
  skillGroups: any,
};

const Progress = ({ categories, levels, skillGroups }) => (
  <div>
    <Table responsive className="progress__table">
      <tbody>
      {
        levels.map(levelName => (
          <Level
            key={levelName}
            categories={categories}
            levelName={levelName}
            skillGroups={skillGroups}
            viewSkillDetails={this.viewSkillDetails}
          />
        ))
      }
      </tbody>
    </Table>
  </div>
);

export default Progress;
