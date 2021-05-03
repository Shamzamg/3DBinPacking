import * as React from 'react';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Box from '../core/Box';

import BoxData from '../core/BoxData';
import BoxPacker from '../core/BoxPacker';
import { ISize } from '../types/Size';
import { sleep } from '../utils/Time';

import './PackerView.css';

export interface IPackerViewProps {
    size: ISize;
    bins: BoxData[];
    animate: boolean;
}

export default class PackerView extends React.Component<IPackerViewProps> {
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private scene: Three.Scene | null = null;
    private renderer: Three.WebGLRenderer | null = null;
    private camera: Three.PerspectiveCamera | null = null;

    componentDidMount() {
        this.createScene();
        window.addEventListener("resize", this.handleResize);
    }

    componentDidUpdate() {
        this.createScene();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    private handleResize = () => {
        this.resizeCanvas();
    }

    public render() {
        return (
            <div>
                <canvas ref={this.canvasRef}></canvas>
            </div>
        );
    }

    private createScene() {
        this.scene = new Three.Scene();
        
        this.renderer = new Three.WebGLRenderer({ antialias: true, canvas: this.canvasRef.current! });

        this.camera = new Three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);

        this.resizeCanvas();
        
        this.camera.position.x = 100;
        this.camera.position.y = 50;
        this.camera.position.z = 100;
        
        //gray background color
        this.renderer.setClearColor("#e5e5e5");
        
        const light1 = new Three.PointLight(0xFFFFFF, 1, 500);
        light1.position.set(10,0,25);
        
        const light2 = new Three.PointLight(0xFFFFFF, 1, 500);
        light2.position.set(150,0,25);
        
        this.scene.add(light1);
        this.scene.add(light2);
        
        // Allow to move camera on resize / drag click with mouse
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.update();
        controls.addEventListener('change', this.renderScene.bind(this));

        // Orbit control will move lights
        new OrbitControls(light1 as any, this.renderer.domElement);
        new OrbitControls(light2 as any, this.renderer.domElement);


        const { size, bins, animate } = this.props;

        const packer = new BoxPacker(size.length, size.height, size.width);
 
        // The main container
        var geometry = new Three.BoxGeometry(packer.length, packer.height, packer.width);
        var material = new Three.LineBasicMaterial({ color: 0xffffff });
        var line = new Three.LineSegments(new Three.EdgesGeometry(geometry), material);
        this.scene.add(line);

        this.renderScene();

        this.putBins(packer);
    }

    /*
    function showStats(packer: BoxPacker, box: Box[]) {
        let packedVolume = 0;
        for(const packed of packer.packed) {
            packedVolume += packed.length * packed.height * packed.width;
        }
        const containerVolume = packer.length * packer.height * packer.width;
        const volumeLeft = containerVolume - packedVolume;
        const fillingPct = (100 * volumeLeft / containerVolume).toFixed(2);

        console.log(`${packer.packed.length}/${box.length} packed`);
        console.log(`Container volume: ${containerVolume}`);
        console.log(`Packed volume: ${packedVolume}`);
        console.log(`Volume left: ${volumeLeft} (${fillingPct}%)`);
    }
    */
    
    private async putBins(packer: BoxPacker) {
        const containerX = -packer.length / 2;
        const containerY = -packer.height / 2;
        const containerZ = -packer.width / 2;

        const timeout = this.props.animate ? 200 : 0;

        const { bins } = this.props;

        bins.sort((a, b) => BoxData.compare(b, a));

        for(const boxData of this.props.bins) {
            let i = 0;
            for(let i = 0; i < boxData.quantity; i++) {
                const box = new Box(boxData);
                if(!packer.pack(box)) {
                    break;
                }
                this.addBox(box, containerX, containerY, containerZ);
                this.renderScene();

                if(timeout > 0) {
                    await sleep(timeout);
                }
            }
        }
    }

    private addBox(box: Box, containerX: number, containerY: number, containerZ: number) {
        const sizeX = box.length;
        const sizeY = box.height;
        const sizeZ = box.width;
    
        //render and place the current box on the screen
        var geometry = new Three.BoxGeometry(sizeX, sizeY, sizeZ);
    
        var material = new Three.MeshLambertMaterial({color: 0xFFFFFF, opacity: 0.5, transparent: true});
        material.color.setHex(Math.random() * 0xffffff);
        var mesh = new Three.Mesh(geometry, material);
    
        mesh.position.x = containerX + box.x + sizeX / 2;
        mesh.position.y = containerY + box.y + sizeY / 2;
        mesh.position.z = containerZ + box.z + sizeZ / 2;
    
        this.scene!.add(mesh);
    }

    private resizeCanvas() {
        if(this.renderer == null || this.scene == null || this.camera == null || this.canvasRef.current == null) {
            return;
        }
        const canvas: HTMLCanvasElement = this.canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.renderer.setSize(canvas.width, canvas.height);
        this.camera.aspect = canvas.width / canvas.height;
        this.camera.updateProjectionMatrix();

        this.renderScene();
    }

    private renderScene() {
        if(this.renderer == null || this.scene == null || this.camera == null) {
            return;
        }
        this.renderer.render(this.scene, this.camera);
    }
}
