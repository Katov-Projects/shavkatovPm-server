import { SetMetadata } from "@nestjs/common";


export const PROTECTED_KEY = 'ROTECTED_KEY';

export const Protected = (isProtected: boolean) =>
  SetMetadata(PROTECTED_KEY, isProtected);