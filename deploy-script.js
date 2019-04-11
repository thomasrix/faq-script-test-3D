const Parcel = require('parcel-bundler');
const fs = require('fs-extra');
const readline = require('readline');

const config = require('./config');
const pathArray = __dirname.split('/');
const folderName = pathArray[pathArray.length -1];

const watcher = require('glob-watcher');


let type, vars;

let startPrompt = ()=>{
    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return prompt;
}
let setVars = ()=>{
    if(process.argv.indexOf("-t") != -1){ //does our flag exist?
        type = process.argv[process.argv.indexOf("-t") + 1]; //grab the next item
    }
    vars = config[type];
    vars.OUT_DIR = `./${type}`;

    for(let a in vars.global){
        process.env[a] = vars.global[a];
    }

    if(type === 'dev'){
        dev();
    }else{
        build();
    }
}
let build = ()=>{
    const checkDestination = new Promise((resolve, reject)=>{
        if(fs.existsSync(vars.DEPLOY_FOLDER)){
            resolve();
        }else{
            reject('The destination folder doesn\'t exist. Check config.js and ensure the folder is mounted.');
        }
    });

    // Start the Party:
    checkDestination.then(
        (result)=>{
            return new Promise((resolve, reject)=>{
                if(fs.existsSync(vars.DEPLOY_FOLDER + folderName)){
                    if(vars.OVERWRITE_CONFIRM){
                        let prompt = startPrompt();
                        prompt.question(`"${vars.DEPLOY_FOLDER + folderName}" \nfindes allerede. Vil du overskrive den? y/n\n`, (answer)=>{
                            prompt.close();
                            (answer === 'y') ? resolve() : reject();
                        })
                    }else{
                        // prompt.close();
                        resolve();
                    }
                }else{
                    // prompt.close();
                    resolve();
                }
            }).then((result)=>{
                console.log('Pakker ...');
                return new Promise((resolve, reject)=>{
                    fs.emptyDirSync(vars.OUT_DIR);
                    const parcel = new Parcel(
                        ['./src/script/index.html','./src/script/index.js'],
                        {
                            outDir:vars.OUT_DIR,
                            watch:false,
                            contentHash:false,
                            publicUrl:'./',
                            minify:vars.MINIFY
                        });
                        parcel.on('bundled', (bundle)=>{
                            resolve('pakkerne')
                        });
                        parcel.on('buildError', (err)=>{
                            reject(err);
                        });
                        parcel.bundle();
                    }).then((result)=>{
                        console.log('Kopierer ... ');
                        fs.emptyDirSync(vars.DEPLOY_FOLDER + folderName);
                        fs.copySync('./src/assets', vars.OUT_DIR + '/assets', {overwrite:true});
                        fs.copySync(vars.OUT_DIR, vars.DEPLOY_FOLDER + folderName, {overwrite:true});
                        console.log('Test URL:\n' + vars.TEST_URL + folderName);
                    }
                ), (err)=>{
                    console.log(err);
                }
            },
            (err)=>{
                console.log('Jamen så lader vi være. Det skal ikke komme an på det da.');
            }
        );
    },
    (err)=>{
        console.log('Error:', err);
        process.exit(0);
    })
}
let dev = ()=>{
    // console.log('dev', process.env.TYPE);
    const parcel = new Parcel(
        ['index.html', '../assets/**/*'],
        {
            outDir:'./dev'
        }
    );
    fs.copy('./src/assets', './dev/assets', {overwrite:true});
    const watch = watcher('./src/assets/**/*.*', (watchdone)=>{
        // console.log('watch triggered')
        fs.emptyDirSync('./dev/assets');
        fs.copy('./src/assets', './dev/assets', {overwrite:true});
        parcel.hmr.broadcast({
            type:'reload'
        })
        watchdone()
    });
    parcel.bundle();
    parcel.serve();
}
setVars();