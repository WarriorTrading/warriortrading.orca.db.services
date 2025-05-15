// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from '@feathersjs/feathers';
import * as hookCommon from 'feathers-hooks-common';
import { publishTableDataChangeEvent } from './hooks/data-change-events.js';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      async (hook: HookContext) => {
        if (hook.data != null) {
          const now = new Date().getTime();
          if (Array.isArray(hook.data)) {
            (hook.data as any[]).forEach((item) => {
              item.created_at = now;
              item.updated_at = now;
            });
          } else {
            hook.data.created_at = now;
            hook.data.updated_at = now;
          }
        }
      },
    ],
    update: [hookCommon.disallow()],
    patch: [
      async (hook: HookContext) => {
        if (hook.data != null) {
          delete hook.data.created_at;
          const now = new Date().getTime();
          hook.data.updated_at = now;
          if (hook.data.closed_at != null) {
            hook.data.closed_at = now;
          }
        }
      },
    ],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [publishTableDataChangeEvent],
    update: [publishTableDataChangeEvent],
    patch: [publishTableDataChangeEvent],
    remove: [publishTableDataChangeEvent],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
