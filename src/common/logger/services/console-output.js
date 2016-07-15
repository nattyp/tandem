import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';
import document from 'common/actors/decorators/document';
import sift from 'sift';

import {
  VERBOSE as VERBOSE_LEVEL,
  INFO as INFO_LEVEL,
  WARN as WARN_LEVEL,
  ERROR as ERROR_LEVEL,
} from 'common/logger/levels';
import chalk from 'chalk';

class ConsoleService extends Service {

  @document('sets a log filter for stdout.')
  setLogFilter(action) {
    this._filter = sift(action.text);
  }

  @document('logs to stdout')
  log({ message, level, filterable }) {

    if (filterable !== false && this._filter && !this._filter(message)) return;

    var log = {
      [VERBOSE_LEVEL]: console.log.bind(console),
      [INFO_LEVEL]: console.info.bind(console),
      [WARN_LEVEL]: console.warn.bind(console),
      [ERROR_LEVEL]: console.error.bind(console),
    }[level];

    var color = {
      [VERBOSE_LEVEL]: 'grey',
      [INFO_LEVEL]: 'blue',
      [WARN_LEVEL]: 'orange',
      [ERROR_LEVEL]: 'red',
    }[level];

    if (typeof window !== 'undefined') {
      log('%c: %c%s', `color: ${color}`, 'color: black', message);
    } else {
      log('%s %s', chalk[color].bold(':'), message);
    }
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/console',
  factory: ConsoleService,
});
