const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        version: '1.0.0',
        title: '넥슬라이스',
        description: '항해99 3조 nexslice',
    },
    host: '127.0.0.1:8000',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Users',
            description:
                '로그인, 회원가입, 아이디 중복검사, 이메일 인증, 이메일 인증 체크, 비밀번호 변경',
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
const endpointsFiles = ['./router/user.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
