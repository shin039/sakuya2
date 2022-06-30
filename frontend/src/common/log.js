const _st_level = process.env.REACT_APP_LOG_LEVEL;

const _LevelInfo = {
  debug: {str: 'DBG', lv: 1, func: console.log  },
  warn : {str: 'WRN', lv: 3, func: console.warn },
  info : {str: 'INF', lv: 5, func: console.log  },
  error: {str: 'ERR', lv: 7, func: console.error},
  fatal: {str: 'FTL', lv: 9, func: console.error},
}

const _log = (levelInfo, msg) => {
  if(levelInfo.lv >= _st_level){
    levelInfo.func(`[${levelInfo.str}]: ${msg}`);

    if( typeof msg === 'object') console.dir(msg, {depth: null});
  }
}

const logs = {
  debug: (msg) => _log(_LevelInfo.debug, msg),
  warn : (msg) => _log(_LevelInfo.warn , msg),
  info : (msg) => _log(_LevelInfo.info , msg),
  error: (msg) => _log(_LevelInfo.error, msg),
  fatal: (msg) => _log(_LevelInfo.fatal, msg),
}

export default logs;

