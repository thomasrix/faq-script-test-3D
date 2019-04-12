'use strict'
import {select, create, lerp} from '../utils/trix';
import '../../styles/canvas.scss';

global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

export default class RainbowBalls{
    constructor(){
        this.props = {
            width:800,
            height:450
        }
        this.init(this.props);
    }
    init(props){
        let {width, height} = props;
        let container = select('[canvas-tester-entry-3d]');
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
                    color:`hsl(${lerp(0, 360, u)}, 50%, 50%)`
                    // color:`hsl(${lerp(0, 360, u)}, ${lerp(10, 100, (v+u)/2)}%, ${lerp(20, 95, (v+u)/2)}%)`
                })
            }
        }
        return points;
    }
    build(props){
        let {width, height, context} = props;
        let margin = width * 0.1;
        
        const renderer = new THREE.WebGLRenderer({
            context
        });
        // WebGL background color
        renderer.setClearColor('hsl(0, 0%, 60%)', 0);
        renderer.setSize(width, height);
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.z = 12;
        // camera.position.y = 0;
        // Setup camera controller
        const controls = new THREE.OrbitControls(camera);
        
        // Setup your scene
        const scene = new THREE.Scene();
        
        const box = new THREE.BoxGeometry(1, 1, 1);
        const sphere = new THREE.SphereGeometry( 0.5, 32, 32 );
        
        const group = new THREE.Group();
        
        const points = this.createGrid();
        points.forEach(({position, color}) => {
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness:0.1,
                roughness:0.4,
                wireframe:false
            });
            const [u, v] = position;
            const x = lerp(-6, 6, u);
            const y = lerp(-3, 3, v);
            const mesh = new THREE.Mesh(
                sphere,
                material
                );
                mesh.position.set(
                    x,
                    y,
                    0
                    );
                    group.add(mesh);
        })
                
                scene.add(group);
                // camera.lookAt(new THREE.Vector3(0, 0, 20));
                
                // Update the camera
                // camera.updateProjectionMatrix();
                
                // Specify an ambient/unlit colour
                scene.add(new THREE.AmbientLight('hsl(0, 0%, 70%)'));
                let d_light = new THREE.PointLight( 0xffffff, 0.5, 20, 20);
                
                d_light.castShadow = true;
                d_light.position.set( 1, 5, 0 );
                
                scene.add(d_light);
                
                
                /*         
                let points = this.createGrid();
                points.forEach(({position, radius, color}) =>{
                    const [u, v] = position;
                    const x = lerp(margin, width - margin, u);
                    const y = lerp(margin, height-margin, v);
                    context.fillStyle = color;
                    context.beginPath();
                    context.arc(x, y, radius, 0, Math.PI * 2);
                    context.fill();
                })
                */    
                const render = ()=>{
                    //    console.log('render')
                    controls.update();
                    renderer.render(scene, camera);
                    requestAnimationFrame(render);
                }
                render();
            }
        }