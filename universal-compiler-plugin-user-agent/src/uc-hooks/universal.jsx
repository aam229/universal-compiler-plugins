import React from 'react';
import {
  register,
  positions,
} from 'universal-compiler';
import {
  hooks,
} from 'universal-compiler-plugin-react';

import UserAgent from '../UserAgent';

register(hooks.REACT_RENDER, (params) => {
  params.ApplicationComponent = (
    <UserAgent headers={params.context.headers}>
      {params.ApplicationComponent}
    </UserAgent>
  );
}, { position: positions.BEFORE });
