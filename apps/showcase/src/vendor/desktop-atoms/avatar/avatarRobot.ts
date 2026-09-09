import robotSvgRaw from './avatar-robot.svg?raw';

let cachedRobotMarkup: string | undefined;

export function getAvatarRobotMarkup(): string {
  if (cachedRobotMarkup) {
    return cachedRobotMarkup;
  }

  cachedRobotMarkup = robotSvgRaw.replace(/<\?xml[^?]*\?\>\s*/i, '').trim();
  return cachedRobotMarkup;
}
