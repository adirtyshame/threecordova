/*jslint browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global THREE:false, requestAnimationFrame:false*/

/*
 * Based on http://threejs.org/examples/canvas_geometry_cube.html
 */

document.addEventListener('DOMContentLoaded', function () {
    var camera, scene, renderer;

    var cube, plane;

    init();
    animate();

    function init() {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            devicePixelRatio: 1
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        //        renderer.shadowMapEnabled = true;
        //        renderer.shadowMapSoft = true;
        document.querySelector('.cube').appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.y = 300;
        camera.position.z = 550;

        scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0x212223));

        // Cube
        var geometry_cube = new THREE.BoxGeometry(200, 200, 200);

        var texture = THREE.ImageUtils.loadTexture('textures/crosswalk.png'); //Works on mobile Android NOT in Browser or Intel XDK
        texture.anisotropy = renderer.getMaxAnisotropy();

        var material_cube = new THREE.MeshBasicMaterial({
            map: texture
        });

        cube = new THREE.Mesh(geometry_cube, material_cube);
        cube.position.y = 300;
        //        cube.castShadow = true;
        scene.add(cube);

        //        // Plane
        //        var geometry_plane = new THREE.PlaneGeometry(800, 800);
        //        geometry_plane.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        //
        //        var material_plane = new THREE.MeshBasicMaterial({
        //            color: 0x888888
        //        });
        //
        //        plane = new THREE.Mesh(geometry_plane, material_plane);
        //        plane.position.y = -50;
        //        plane.receiveShadow = true;
        //        scene.add(plane);
        //
        //        //spotlight
        //        var spotLight = new THREE.SpotLight(0xffffff, 1);
        //        spotLight.position.set(0, 850, 0);
        //
        //        spotLight.castShadow = true;
        //
        //        spotLight.target.position.set(0, 300, 0);
        //        spotLight.shadowDarkness = 0.5;
        //
        //        spotLight.shadowCameraNear = 150;
        //        spotLight.shadowCameraFar = 1000;
        ////        spotLight.shadowCameraVisible = true;
        //        scene.add(spotLight);


        // Generic setup

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }


    var onDeviceReady = function () {                          // called when Cordova is ready
        if (window.Cordova && navigator.splashscreen) {     // Cordova API detected
            navigator.splashscreen.hide();                 // hide splash screen
        }
        if (navigator.fusion) {
            console.log('SensorFusion available.');
            navigator.fusion.watchSensorFusion(function (result) {
                cube.quaternion.set(result.quaternion.x, result.quaternion.y, result.quaternion.z, result.quaternion.w);
            }, function (err) {
                console.log('error', err);
            }, {
                frequency: 10
            });
        }
    };
    document.addEventListener("deviceready", onDeviceReady, false);

    document.getElementById("providerSelector").onchange = function () {
        var x = document.getElementById("providerSelector").value;
        if (navigator.fusion) {
            navigator.fusion.setMode(function (result) {
                console.log('result', result);
            }, function (err) {
                console.log('err', err);
            }, {
                mode: x
            });
        }
    }

});