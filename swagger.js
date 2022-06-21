const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        version: '1.0.0',
        title: '넥슬라이스',
        description: '항해99 3조 nexslice',
    },
    host: '15.164.50.132',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Users',
            description:
                '로그인, 회원가입, 아이디 중복검사, 이메일 인증, 이메일 인증 체크, 비밀번호 변경, 마이 페이지, 마이 페이지 수정',
        },
        {
            name: 'Movie',
            description: '영화 전체 조회, 메인 영상, 영상 상세 조회',
        },
        {
            name: 'Like',
            description: '좋아요 추가, 좋아요,취소',
        },
        {
            name: 'Mylist',
            description: '찜 추가, 찜 취소, 찜한목록',
        },
        {
            name: 'Search',
            description: '검색기능',
        },
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-KEY',
            description: 'any description...',
        },
    },
};
const outputFile = './swagger-output.json';
const endpointsFiles = [
    './router/user.js',
    './router/movie.js',
    './router/like.js',
    './router/mylist.js',
    './router/search.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
