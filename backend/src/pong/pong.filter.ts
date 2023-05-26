import { BadRequestException, ArgumentsHost, Catch } from "@nestjs/common"
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets"

// rationale https://github.com/nestjs/nest/issues/5267
@Catch(BadRequestException)
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    super.catch(new WsException(exception.getResponse()), host)
  }
}