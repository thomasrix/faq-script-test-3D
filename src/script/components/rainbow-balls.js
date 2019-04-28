'use strict'
import {select, create, lerp} from '../utils/trix';
import '../../styles/canvas.scss';

global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

export default class RainbowBalls{
    constructor(){
        this.props = {
            gridSize:10,
            size:{
                horisontal:{
                    xCount:10,
                    yCount:4,
                    width:800,
                    height:450
                },
                vertical:{
                    xCount:4,
                    yCount:8,
                    width:450,
                    height:800
                }
            }
        }
        this.init(this.props);
    }
    querySwitch(q){
        // console.log('switch', q.matches);
        console.log(this)
        this.orientation = (q.matches) ? 'vertical' : 'horisontal';
        this.setCanvasSize();
    }
    setCanvasSize(){
        let {width, height} = this.props.size[this.orientation];
        this.canvas.width = width;
        this.canvas.height = height;

    }
    init(props){
        let container = select('[canvas-tester-entry-3d]');
        this.canvas = create('canvas', container, 'faq-ct-canvas');
        // this.setCanvasSize();
        props.context = this.canvas.getContext('webgl');

        this.query = window.matchMedia("(max-width: 500px)");
        this.querySwitch(this.query);
        // console.log(this.orientation);

        this.query.addListener(this.querySwitch.bind(this));

        // console.log(props);
        this.build(props);
    }
    createGrid(){
        //const count = 10;
        let {xCount, yCount} = this.props.size[this.orientation];
        const points = [];
        for (let y = 0 ; y < yCount ; y++){
            for (let x = 0 ; x < xCount; x++){
                const u = x / (xCount - 1);
                const v = y / (yCount - 1);
                points.push({
                    position:[
                        u, v
                    ],
                    radius:25,
                    color:`hsl(${lerp(0, 360, u)}, 50%, 50%)`
                    // color:`hsl(${lerp(0, 360, u)}, ${lerp(10, 100, (v+u)/2)}%, ${lerp(20, 95, (v+u)/2)}%)`
                })
            }
        }
        return points;
    }
    build(props){
        let {context} = props;
        let {width, height} = props.size[this.orientation];
        
        const renderer = new THREE.WebGLRenderer({
            context
        });
        // WebGL background color
        renderer.setClearColor('hsl(0, 0%, 60%)', 0.02);
        renderer.setSize(width, height);
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.z = 12;
        // camera.position.y = 0;
        // Setup camera controller
        const controls = new THREE.OrbitControls(camera);
        controls.enableZoom = false;
        
        // Setup your scene
        const scene = new THREE.Scene();
        
        const box = new THREE.BoxGeometry(1, 1, 1);
        const sphere = new THREE.SphereGeometry( 0.5, 32, 32 );
        
        const group = new THREE.Group();
        
        const points = this.createGrid();
        
        points.forEach(({position, color}) => {
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness:0.5,
                roughness:0.1,
                wireframe:false
            });
            const [u, v] = position;
            const x = lerp(-6, 6, u);
            const y = lerp(-2, 2, v);
            // spacing aspect = smaller amount / larger amount * larger spacing
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
                scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
                let d_light = new THREE.PointLight( 0xffffcc, 1, 20, 20);
                
                d_light.castShadow = true;
                d_light.position.set( 10, 15, 7 );
                
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