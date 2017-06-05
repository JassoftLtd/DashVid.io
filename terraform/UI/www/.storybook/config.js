import { configure } from '@storybook/react';

function loadStories() {
  require('../src/components');
}

configure(loadStories, module);
