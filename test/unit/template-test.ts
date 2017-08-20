import { expect } from 'chai';

import template from '../../backend/models/matrices/template';
import fixtureTemplates from '../fixtures/templates';


describe('new evaluation', () => {
  it('creates a new evaluation for a user', () => {
    const testTemplate = template(fixtureTemplates[0] as any);
    const output = testTemplate.addSkill('Expert', 'Magicness', 5);
    expect(output.skillGroups[5].skills).to.contain(5);
  });
});
