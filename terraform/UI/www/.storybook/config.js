import { configure } from '@storybook/react';

function loadStories() {
  require('../src/components/account/account.stories');
  require('../src/components/page/page.stories');
  require('../src/components/plan/plan.stories');
  require('../src/components/video/video.stories');
}

configure(loadStories, module);
