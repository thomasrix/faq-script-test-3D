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
                    yCount:5,
                    width:800,
                    height:450,
                    xRange:7.5,
                    zoom:14
                },
                vertical:{
                    xCount:5,
                    yCount:9,
                    width:450,
                    height:800,
                    xRange:2.75,
                    zoom:18
                }
            }
        }
        this.init(this.props);
    }
    init(props){
        let container = select('[canvas-tester-entry-3d]');
        this.canvas = create('canvas', container, 'faq-ct-canvas');
        props.context = this.canvas.getContext('webgl');
        
        this.query = window.matchMedia("(max-width: 500px)");
        this.querySwitch(this.query);
        
        this.query.addListener(this.querySwitch.bind(this));
        
        this.build(props);
    }
    querySwitch(q){
        this.orientation = (q.matches) ? 'vertical' : 'horisontal';
        this.setCanvasSize();

    }
    setCanvasSize(){
        let {width, height} = this.props.size[this.orientation];
        this.canvas.width = width;
        this.canvas.height = height;
        if(this.populated){
            this.emptyGroup();
            this.populateGroup(this.createGrid());
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
        
    }
    emptyGroup(){
        for (let i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
    }
    populateGroup(points){
        let {xCount, yCount, xRange} = this.props.size[this.orientation];
        let yRange = (yCount - 1) / (xCount -1) * xRange;
        // spacing aspect = smaller amount / larger amount * larger spacing
        points.forEach(({position, color}) => {
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness:0.5,
                roughness:0.1,
                wireframe:false
            }
            );
            const [u, v] = position;
            const x = lerp(-xRange, xRange, u);
            const y = lerp(-yRange, yRange, v);
            const mesh = new THREE.Mesh(this.sphere, material);
            mesh.position.set(x, y, 0);
            this.group.add(mesh);
        }
        )
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
                    color:`hsl(${lerp(0, 360, u)}, 50%, 50%)`
                    // color:`hsl(${lerp(0, 360, u)}, ${lerp(10, 100, (v+u)/2)}%, ${lerp(20, 95, (v+u)/2)}%)`
                })
            }
        }
        return points;
    }
    build(props){
        let {context} = props;
        let {width, height, zoom} = props.size[this.orientation];
        
        this.renderer = new THREE.WebGLRenderer({
            context
        });
        // WebGL background color
        this.renderer.setClearColor('hsl(0, 0%, 60%)', 0.02);
        this.renderer.setSize(width, height);
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.camera.position.z = zoom;
        // camera.position.y = 0;
        // Setup camera controller
        const controls = new THREE.OrbitControls(this.camera);
        controls.enableZoom = false;
        
        // Setup your scene
        const scene = new THREE.Scene();
        
        this.sphere = new THREE.SphereGeometry( 0.5, 32, 32 );
        
        this.group = new THREE.Group();
        
        const points = this.createGrid();

        this.populateGroup(points);
        this.populated = true;
        
        scene.add(this.group);
        // camera.lookAt(new THREE.Vector3(0, 0, 20));
        
        // Update the camera
        // camera.updateProjectionMatrix();
        
        // Specify an ambient/unlit colour
        scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
        let d_light = new THREE.PointLight( 0xffffcc, 1, 20, 20);
        
        d_light.castShadow = true;
        d_light.position.set( 10, 15, 7 );
        
        scene.add(d_light);
        
        const render = ()=>{
            controls.update();
            this.renderer.render(scene, this.camera);
            requestAnimationFrame(render);
        }
        render();
    }
}