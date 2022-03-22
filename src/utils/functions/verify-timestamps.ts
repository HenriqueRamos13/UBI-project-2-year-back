import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment-timezone';

export function verifyTimestamps(req, res, next) {
  try {
    const timestamp = req.headers['timestamp'];

    console.log(moment().tz('America/Sao_Paulo'));

    if (!timestamp) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Ocorreu um error inesperado',
      });
    }

    const diff = Date.now() - Number(timestamp);

    console.log(diff / 1000, moment().tz('America/Sao_Paulo'));

    if (Math.round(diff / 1000) > 20) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Ocorreu um error inesperado',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    throw new BadRequestException({
      statusCode: 400,
      error: 'Ocorreu um error inesperado',
    });
  }
}
