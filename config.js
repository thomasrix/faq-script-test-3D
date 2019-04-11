let config = {
    dev: {
        global:{
            TYPE:'Local development',
            DEBUGGING:true,
            ASSETS_PATH:'assets/',
        }
    },
    stage: {
        global:{
            TYPE:'Staging',
            DEBUGGING:true,
            ASSETS_PATH:'http://localhost:8888/boiler-test/stage/parceljs-boilerplate/assets/'
        },
        DEPLOY_FOLDER:'/Users/trix/Documents/udvikling/boiler-test/stage/',
        OVERWRITE_CONFIRM:true,
        MINIFY:false,
        TEST_URL:'http://localhost:8888/boiler-test/stage/',
    },
    deploy: {
        global:{
            TYPE:'Production',
            DEBUGGING:false,
            ASSETS_PATH:'http://localhost:8888/boiler-test/deploy/parceljs-boilerplate/assets/'
        },
        DEPLOY_FOLDER:'/Users/trix/Documents/udvikling/boiler-test/deploy/',
        OVERWRITE_CONFIRM:true,
        MINIFY:true,
        TEST_URL:'http://localhost:8888/boiler-test/deploy/',
    }
}
module.exports = config;