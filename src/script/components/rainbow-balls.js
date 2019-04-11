'use strict'
import {select, create, lerp} from '../utils/trix';
import '../../styles/canvas.scss';

global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

export default class RainbowBalls{
    constructor(){
        this.props = {
            width:1920,
            height:1080
        }
        this.init(this.props);
    }
    init(props){
        let {width, height} = props;
        let container = select('[canvas-tester-entry]');
        let canvas = create('canvas', container, 'faq-ct-canvas');
        canvas.width = width;
        canvas.height = height;
        props.context = canvas.getContext('webgl');
        console.log(props);
        this.build(props);
    }
    createGrid(){
        const count = 10;
        const points = [];
        for (let y = 0 ; y < count/2 ; y++){
            for (let x = 0 ; x < count; x++){
                const u = x / (count - 1);
                const v = y / (count/2 - 1);
                points.push({
                    position:[
                        u, v
                    ],
                    radius:40,
                    color:`hsl(${lerp(0, 360, u)}, ${lerp(10, 100, (v+u)/2)}%, ${lerp(20, 95, (v+u)/2)}%)`
                })
            }
        }
        return points;
    }
    build(props){
        let {width, height, context} = props;
        let margin = width * 0.1;
        let c = context;

/*         let points = this.createGrid();
        points.forEach(({position, radius, color}) =>{
            const [u, v] = position;
            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height-margin, v);
            context.fillStyle = color;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        })
 */    }
}