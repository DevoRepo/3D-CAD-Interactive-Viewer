// Set up scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor(0xffffff, 1); // Set background color to white
document.getElementById('model-container').appendChild(renderer.domElement);

// Set up orbit controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.25; // Damping inertia factor
controls.screenSpacePanning = false; // Disable panning
controls.minDistance = 1; // Minimum zoom distance
controls.maxDistance = 100; // Maximum zoom distance

// Set up lighting
var ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight1.position.set(1, 1, 1).normalize();
directionalLight1.castShadow = true;
scene.add(directionalLight1);

var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight2.position.set(-1, -1, -1).normalize();
directionalLight2.castShadow = true;
scene.add(directionalLight2);

var pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, -10, 10); // Position the light below the model
pointLight.castShadow = true;
scene.add(pointLight);

var cursorLight = new THREE.PointLight(0xffffff, 1);
cursorLight.castShadow = true;
scene.add(cursorLight);
var cursorLightEnabled = false;

console.log('Scene, camera, and renderer set up');

// Function to load the model based on its type
function loadModel(url, type) {
    var loader;
    console.log('Loading model:', url, 'of type:', type);

    if (type === 'obj') {
        loader = new THREE.OBJLoader();
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('static/models/');
        mtlLoader.load('model.mtl', function (materials) {
            console.log('Loaded materials:', materials);
            materials.preload();
            loader.setMaterials(materials);
            loader.load(url, function (object) {
                console.log('Loaded object:', object);
                object.position.set(0, 0, 0);
                object.castShadow = true;
                object.receiveShadow = true;
                scene.add(object);
                document.getElementById('loading-screen').style.display = 'none'; // Hide loading screen
            }, undefined, function (error) {
                console.error('An error occurred while loading the OBJ model:', error);
            });
        }, undefined, function (error) {
            console.error('An error occurred while loading the MTL file:', error);
            // Fallback to loading the OBJ file without materials
            loader.load(url, function (object) {
                console.log('Loaded object without materials:', object);
                object.position.set(0, 0, 0);
                object.castShadow = true;
                object.receiveShadow = true;
                scene.add(object);
                document.getElementById('loading-screen').style.display = 'none'; // Hide loading screen
            }, undefined, function (error) {
                console.error('An error occurred while loading the OBJ model without materials:', error);
            });
        });
    } else if (type === 'stl') {
        loader = new THREE.STLLoader();
        loader.load(url, function (geometry) {
            var material = new THREE.MeshStandardMaterial({ color: 0x0055ff, side: THREE.DoubleSide });
            var mesh = new THREE.Mesh(geometry, material);
            console.log('Loaded STL mesh:', mesh);
            mesh.position.set(0, 0, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
            document.getElementById('loading-screen').style.display = 'none'; // Hide loading screen
        }, undefined, function (error) {
            console.error('An error occurred while loading the STL model:', error);
        });
    } else if (type === 'ply') {
        loader = new THREE.PLYLoader();
        loader.load(url, function (geometry) {
            var material = new THREE.MeshStandardMaterial({ color: 0x0055ff, side: THREE.DoubleSide });
            var mesh = new THREE.Mesh(geometry, material);
            console.log('Loaded PLY mesh:', mesh);
            mesh.position.set(0, 0, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
            document.getElementById('loading-screen').style.display = 'none'; // Hide loading screen
        }, undefined, function (error) {
            console.error('An error occurred while loading the PLY model:', error);
        });
    }
}

// Example usage: load a model based on its type
loadModel('static/models/model.obj', 'obj');

camera.position.set(0, 0, 10);
console.log('Camera position set');

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
}

animate();
console.log('Render loop started');

// Event listeners for color and brightness controls
document.getElementById('background-color-picker').addEventListener('input', function(event) {
    var color = event.target.value;
    renderer.setClearColor(color, 1);
});

document.getElementById('brightness-slider').addEventListener('input', function(event) {
    var brightness = event.target.value;
    scene.traverse(function(object) {
        if (object.isLight) {
            object.intensity = brightness;
        }
    });
});

// Event listener for toggling cursor light
document.getElementById('toggle-light-button').addEventListener('click', function() {
    cursorLightEnabled = !cursorLightEnabled;
    if (cursorLightEnabled) {
        document.getElementById('toggle-light-button').innerText = 'Disable Illuminate from Cursor';
    } else {
        document.getElementById('toggle-light-button').innerText = 'Illuminate from Cursor';
    }
});

window.addEventListener('mousemove', function(event) {
    if (cursorLightEnabled) {
        var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        var vector = new THREE.Vector3(mouseX, mouseY, 0.5).unproject(camera);
        cursorLight.position.copy(vector);
    }
});
