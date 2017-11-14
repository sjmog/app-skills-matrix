import * as React from 'react';

import { InputGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';

type QuestionsProps = {
  questions: any,
  update: (value: string, index: number) => void,
  remove: (index: number) =>  void,
};

const Questions = ({ questions, update, remove }: QuestionsProps) => (
  <div>
    {
      questions.map((q, index) => (
        <div key={`question_${index}`} className="questions-list__row">
          <InputGroup>
            <FormControl
              name={`question_${index}`}
              key={`question_${index}`}
              type="text"
              value={q.title}
              onChange={(e: any) => update(e.target.value, index)}
              placeholder="Question"
            />
            <InputGroup.Button>
              <Button onClick={() => remove(index)}>
                <Glyphicon glyph="remove"/>
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </div>
      ))
    }
  </div>
);

export default Questions;
