import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { tags } from './tags.js';

let selectedObject = null;
let originalPosition = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 50;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const sizeDisplay = document.getElementById('size-display');

function createTagCloud(tags) {
    tags.forEach(tag => {
        const texture = new THREE.TextureLoader().load(tag.url);
        const imageMaterial = new THREE.SpriteMaterial({ map: texture });
        const image = new THREE.Sprite(imageMaterial);
        image.scale.set(tag.size, tag.size, 1);

        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * 2 * Math.PI;
        const radius = 5;
        image.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );

        image.userData.size = tag.size; // Store the normalized size
        image.userData.originalSize = tag.originalSize; // Store the original size
        scene.add(image);
    });
}

createTagCloud(tags);

camera.position.z = 15;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (selectedObject !== clickedObject) {
            if (selectedObject) {
                gsap.to(selectedObject.position, {
                    x: originalPosition.x,
                    y: originalPosition.y,
                    z: originalPosition.z,
                    duration: 1
                });
            }

            originalPosition = clickedObject.position.clone();
            selectedObject = clickedObject;

            const vector = new THREE.Vector3(0, 0, -5);
            vector.applyMatrix4(camera.matrixWorld);
            gsap.to(clickedObject.position, {
                x: vector.x,
                y: vector.y,
                z: vector.z,
                duration: 1
            });

            // Display the original size
            sizeDisplay.innerText = `Size: ${clickedObject.userData.originalSize}`;
            sizeDisplay.style.display = 'block';
        }
    } else {
        if (selectedObject) {
            gsap.to(selectedObject.position, {
                x: originalPosition.x,
                y: originalPosition.y,
                z: originalPosition.z,
                duration: 1
            });
            selectedObject = null;

            // Hide the size display
            sizeDisplay.style.display = 'none';
        }
    }
}

window.addEventListener('click', onMouseClick);