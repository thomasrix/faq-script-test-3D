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
            ASSETS_PATH:'http://localhost:8888/local-deploy/stage/parceljs-boilerplate/assets/'
        },
        DEPLOY_FOLDER:'/Users/trix/Documents/udvikling/local-deploy/stage/',
        OVERWRITE_CONFIRM:true,
        MINIFY:false,
        TEST_URL:'http://localhost:8888/local-deploy/stage/',
    },
    deploy: {
        global:{
            TYPE:'Production',
            DEBUGGING:false,
            ASSETS_PATH:'http://localhost:8888/local-deploy/deploy/parceljs-boilerplate/assets/'
        },
        DEPLOY_FOLDER:'/Users/trix/Documents/udvikling/local-deploy/deploy/',
        OVERWRITE_CONFIRM:true,
        MINIFY:true,
        TEST_URL:'http://localhost:8888/local-deploy/deploy/',
    }
}
module.exports = config;