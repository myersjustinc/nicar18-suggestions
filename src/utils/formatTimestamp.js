import { format } from 'd3-format';

const twoDigit = format('>002');

export default function formatTimestamp(rawTimestamp) {
  const timestampPattern = /^(\d+)\/(\d+)\/(\d+) (\d+:\d+:\d+)$/;
  const timestampMatch = timestampPattern.exec(rawTimestamp);
  return (
    timestampMatch[3] + '-' + twoDigit(timestampMatch[1]) + '-' +
    twoDigit(timestampMatch[2]) + 'T' + timestampMatch[4]);
}
