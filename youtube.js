// AIzaSyBbeLeopMBV5V1TpnFJu4nwbM4FKWe4uy4;
var Youtube = require('youtube-node');
var youtube = new Youtube();
const Movie = require('./models/movie');

var word = '강아지'; // 검색어 지정
var limit = 1; // 출력 갯수

youtube.setKey('AIzaSyCy4sIRPEWJ1gB-H4Ytx5WRRdlL10LnM7I'); // API 키 입력

//// 검색 옵션 시작
youtube.addParam('order', 'rating'); // 평점 순으로 정렬
youtube.addParam('type', 'video'); // 타입 지정
youtube.addParam('videoLicense', 'creativeCommon'); // 크리에이티브 커먼즈 아이템만 불러옴
//// 검색 옵션 끝

youtube.search(word, limit, async (err, result) => {
    // 검색 실행
    if (err) {
        console.log(err);
        return;
    } // 에러일 경우 에러공지하고 빠져나감

    console.log(JSON.stringify(result, null, 2)); // 받아온 전체 리스트 출력
    var items = result['items']; // 결과 중 items 항목만 가져옴
    var video_id = items[0].id.videoId;
    var videoUrl = 'https://youtube.com/embed/' + video_id;
    var imgUrl = items[0].snippet.thumbnails.high.url;
    var title = items[0].snippet.title;
    // var content =
    //     '우연히 연쇄살인마의 표적이 되었다 살아난 조직 보스 장동수와범인잡기에 혈안이 된 강력반 미친개 정태석.타협할 수 없는 두 사람이 연쇄살인마 K를 잡기 위해 손잡는다.표적은 하나, 룰도 하나!먼저 잡는 놈이 갖는다!';
    // var category = 'action';
    // var director = '이원태';
    // var writer = '양태원';
    // var actor =
    //     '마동석(장동수),김무열(정태석),김성규(강경호),유승목(안호봉),최민철(권오성)';
    // await Movie.create({
    //     videoUrl,
    //     imgUrl,
    //     title,
    //     content,
    //     category,
    //     director,
    //     writer,
    //     actor,
    // });

    for (var i in items) {
        var it = items[i];
        var title = it['snippet']['title'];
        var video_id = it['id']['videoId'];
        // var imgUrl = it['snippet']['thumbnails']['high']['url'];
        var videoUrl = 'https://youtube.com/embed/' + video_id;
    }
    //     // 유튜브 영상 링크
    console.log('제목 : ' + title);
    console.log('URL : ' + videoUrl);
    console.log('img : ' + imgUrl);
    console.log('-----------');
});
