'use strict';
import {create, select} from '../utils/trix';
export default class Example {
    constructor() {
        this.build();
    }

    build() {

        let container = select('[entry-point]');

        container.innerHTML = '';

        let content = create('div', container, ['debug-container','content']);

        content.innerHTML = this.testHTML();

    }
    testHTML(){
        console.log('test', process.env.DEBUGGING);
        let DEBUGGING = process.env.DEBUGGING;
        let ASSETS_PATH = process.env.ASSETS_PATH;
        let type = process.env.TYPE;
        return `Så er der hul igennem! <br/>
        Vi kører i konfigurationen: ${type.toUpperCase()} <br/>
        Debug variablen er sat til: <span class="highlight">${DEBUGGING}</span><br/>
        Stien til assets er sat til:
        <span class="path-thing">${ASSETS_PATH}</span>
        <img src="${ASSETS_PATH}images/train.svg"/>`;
    }

}