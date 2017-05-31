import React from 'react';
import {
  register,
  hooks,
  positions,
} from 'universal-compiler';

import UserAgent from '../UserAgent';

register(hooks.RENDER, promise => promise.then((params) => {
  params.ApplicationComponent = (
    <UserAgent headers={params.headers}>
      {params.ApplicationComponent}
    </UserAgent>
    );
  return params;
}), { position: positions.BEFORE });
