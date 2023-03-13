import qs from 'qs';

const Test = () => {
  console.log('test');
  import('./module-a').then(doShare => {
    console.log('doShare', doShare);
    doShare.default()
  })
  import('./module-b').then(doWebp => {
    console.log('doWebp', doWebp);
    doWebp.default('https://www.baidu.com/img/bd_logo1.png')
  })
  import('./module-c').then(doShare => {
    console.log('doShare', doShare);
    doShare.default({
      title: '分享标题',
      desc: '分享描述',
      link: 'https://www.baidu.com',
      imgUrl: 'https://www.baidu.com/img/bd_logo1.png',
    })
  })
  const urlData = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  console.log('urlData', urlData);
}
