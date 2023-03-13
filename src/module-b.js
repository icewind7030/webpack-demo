import { isSupportWebp } from 'nw-detect';

export default function(url) {
  if (isSupportWebp()) {
    return url + '?imageView&type=webp';
  }
  return url;
}