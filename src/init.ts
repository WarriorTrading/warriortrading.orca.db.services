import fs from 'fs/promises'
import fss from 'fs'

export const initApp = async () => {
  // delete mark file (used to wait for starting)
  const mark = '/tmp/isAppInited';
  if (fss.existsSync(mark)) await fs.rm(mark);

  // Add init code here

  // create mark file. this file is used by readinessProbe
  await fs.writeFile(mark, 'inited');
} 