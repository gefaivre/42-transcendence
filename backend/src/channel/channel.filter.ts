import { Catch, ArgumentsHost, Logger, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ChannelExceptionsFilter extends BaseExceptionFilter {

  private readonly logger: Logger = new Logger('ChannelController', { timestamp: true })

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception)
    super.catch(exception, host);
  }
}
