import { BadRequestException } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';
import { SafeNumberTransform } from '../transforms/safe-number.transform';

function iterAll(object) {
  Object.keys(object).forEach(function (k) {
    if (
      typeof object[k] === 'boolean' ||
      typeof object[k] === 'undefined' ||
      typeof object[k] === 'function' ||
      typeof object[k] === 'symbol'
    ) {
      return;
    }

    if (object[k] && typeof object[k] === 'object') {
      iterAll(object[k]);
      return;
    }
    const verifyIfIsNumber =
      typeof object[k] === 'string' ? false : !Number.isNaN(object[k]);

    object[k] = sanitizeHtml(object[k], {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (verifyIfIsNumber) {
      object[k] = SafeNumberTransform({ value: object[k] });
    }
  });
}

export const Sanitize = (value) =>
  new Promise((resolve, reject) => {
    try {
      iterAll(value);
      resolve(value);
    } catch (error) {
      throw new BadRequestException('Validation failed - ' + error);
    }
  });
