const deploy = require('ali-oss-deploy')

deploy({
    path: '../build',   // 改为自己的静态资源目录
    ossConfig: {   // oss配置参数
        region: 'oss-cn-beijing',
        accessKeyId: 'LTAI5tM2TiekLnGyt7RMJsVc',
        accessKeySecret: 'XI4NGMPd7N4xnElfuMRydMWGW4pRXe',
    },
    bucket: {
        pro: {
            name: 'lzc-weather-report',
        },
    },
})
