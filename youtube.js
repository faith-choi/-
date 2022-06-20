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

    var videoUrl = 'https://tv.naver.com/embed/26947241';
    var imgUrl = 'https://movie.naver.com/movie/bi/mi/basic.naver?code=196367';
    var title = '마녀(魔女) Part2. The Other One';
    var content =
        '통제불능의 존재가 세상 밖으로 나왔다!’자윤’이 사라진 뒤,정체불명의 집단의 무차별 습격으로 마녀 프로젝트가 진행되고 있는 ‘아크’가 초토화된다.그곳에서 홀로 살아남은 ‘소녀’는 생애 처음 세상 밖으로 발을 내딛고 우연히 만난 ‘경희’의 도움으로 농장에서 지내며 따뜻한 일상에 적응해간다.한편, ‘소녀’가 망실되자 행방을 쫓는 책임자 ‘장’과 마녀 프로젝트의 창시자 ‘백총괄’의 지령을 받고 제거에 나선 본사 요원 ‘조현’, ‘경희’의 농장 소유권을 노리는 조직의 보스 ‘용두’와 상해에서 온 의문의 4인방까지 각기 다른 목적을 지닌 세력이 하나 둘 모여들기 시작하면서 ‘소녀’ 안에 숨겨진 본성이 깨어나는데…모든 것의 시작,더욱 거대하고 강력해진 마녀가 온다.';
    var category = '액션';
    var director = '박훈정';
    var actor = '신시아, 박은빈, 서은수';
    await Movie.create({
        videoUrl,
        imgUrl,
        title,
        content,
        category,
        director,
        actor,
    });

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
