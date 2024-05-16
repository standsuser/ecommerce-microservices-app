import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user_id;
  },
);

export const SessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session_id;
  },
);

export const EitherUserIdOrSessionId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user_id = request.user_id;
    const session_id = request.session_id;

    if ((user_id && session_id) || (!user_id && !session_id)) {
      return null;
    } else {
      throw new Error('Either user_id or session_id must be provided, but not both.');
    }
  },
);