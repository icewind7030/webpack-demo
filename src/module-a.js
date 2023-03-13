import { share } from 'nw-share';

export default function(data) {
  const shareData = data || {
    title: '分享标题',
    desc: '分享描述',
    link: 'https://www.baidu.com',
    imgUrl: 'https://www.baidu.com/img/bd_logo1.png',
  };
  share(shareData);
}