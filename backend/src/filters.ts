import { Catch, ArgumentsHost, Logger, HttpException, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets"

@Catch()
export class TranscendenceExceptionsFilter extends BaseExceptionFilter {

  private readonly logger: Logger = new Logger('ChannelController', { timestamp: true })

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception)
    super.catch(exception, host);
  }
}

// rationale https://github.com/nestjs/nest/issues/5267
@Catch(BadRequestException)
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    super.catch(new WsException(exception.getResponse()), host)
  }
}