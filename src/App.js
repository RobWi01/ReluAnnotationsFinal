import { Physics } from "@react-three/cannon"
import React from "react"
import { VRCanvas } from "@react-three/xr"
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'

const loader = new STLLoader();
THREE.Cache.enabled = true;
let meshMandible = null;

const Stlviewer = React.memo(function Stlviewer({
  file,
  setSkullLoaded,
}) {
  LoadSkull(setSkullLoaded);

  const threeContainerRef = useRef(null);
  //STL file loading
  useEffect(() => {
    Init();
    THREE.Cache.enabled = true;

    //add Container to renderer
    threeContainerRef.current.appendChild(renderer.domElement);

    //dunno what this do
    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    var materials = {};
    for (var x = 1; x < 5; x++) {
      for (var y = 1; y < 9; y++) {
        let toothname = "Tooth_".concat(x.toString()).concat(y.toString());
        const materialTooth = new THREE.MeshPhongMaterial({
          color: 0xd3d3d3,
          opacity: 1.0,
          transparent: true,
        });
        materials[toothname] = materialTooth;
      }
    }
    dictPositions = {};
    for (var x = 1; x < 5; x++) {
      for (var y = 1; y < 8; y++) {
        let filename = "Tooth_".concat(x.toString()).concat(y.toString());
        loader.load(
          "https://annosend.blob.core.windows.net/stl-files/" +
            filename +
            ".stl",
          function (geometry) {
            geometry.translate(0, 0, 35);
            let toothNr = parseInt(filename.split("_").pop());
            //let a = Math.floor(toothNr / 10);
            //let b = toothNr % 10;

            const mesh = new THREE.Mesh(geometry, materials[filename]);
            scene.add(mesh);
            mesh.name = filename;
            getAbsolutePosition(mesh, dictPositions);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {}
        );
      }
    }

    loader.load(
      "https://annosend.blob.core.windows.net/stl-files/Mandible.stl",
      function (geometry) {
        geometry.translate(0, 0, 35);
        const mesh = new THREE.Mesh(geometry, materialMandible);
        scene.add(mesh);
        mesh.name = "Mandible";
        getAbsolutePosition(mesh, dictPositions);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );

    anim();

    if (document != undefined) {
      document.addEventListener("dblclick", function (event) {
        //integrate raycasting to differentiate between on teeth and on empty space
        let foundtooth = false;
        const mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        for (var i = 0; i < intersects.length; i++) {
          if (intersects[i].object instanceof THREE.Mesh && !foundtooth) {
            console.log("change camera", intersects[i].object.name); //Rob

            var teeth_id = intersects[i].object.name;

            if (dictPositions[teeth_id] == undefined) {
              alert("This object is not present");
              return;
            }

            var posx = dictPositions[teeth_id].x;
            var posy = dictPositions[teeth_id].y;
            var posz = dictPositions[teeth_id].z;

            console.log(teeth_id);

            if (teeth_id == "SkullMesh") {
              controls.setLookAt(0, -160, 50, posx, posy, posz, true);
              return;
            } else if (teeth_id == "Mandible") {
              controls.setLookAt(0, -95, -15, posx, posy, posz, true);
              return;
            }

            const teethIDS = teeth_id.split("_");

            if (teethIDS[1] == "17") {
              controls.setLookAt(-49, -0.6, 10.44, posx, posy, posz, true);
            } else if (teethIDS[1] == "27") {
              controls.setLookAt(51, -0.6, 10.44, posx, posy, posz, true);
            } else if (Number(teethIDS[1]) > 28) {
              controls.setLookAt(2 * posx, 2 * posy, 0, posx, posy, posz, true);
            } else {
              controls.setLookAt(
                2 * posx,
                2 * posy,
                10.44,
                posx,
                posy,
                posz,
                true
              );
            }

            foundtooth = true;
          }
        }
      });
    }
  });
  return <div ref={threeContainerRef} />;
});
    function Init() {
      //creating scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
    
      //light
      followLight = new THREE.DirectionalLight(0xffffff, 1.0);
      followLight.position.set(20, 100, 10);
      followLight.target.position.set(0, 0, 0);
      followLight.castShadow = true;
      scene.add(followLight);
    
      light = new THREE.AmbientLight(0x404040, 0.25);
      scene.add(light);
    
      //CAMERA
      camera = new THREE.PerspectiveCamera(
        90, //field of view, number of vertical degrees it is seen --> lower : objects are closer <-> higher : objects are farther
        window.innerWidth / window.innerHeight,
        0.1, //distance from camera object starts to appear
        1000 //distance from camera objects stops appearing
      );
    
      camera.position.set(0, -128, 0);
      //camera.rotation.set(0, 100, 0);
      requestAnimationFrame(render);
      camera.updateProjectionMatrix();
      camera.up.set(0, 0, 1);
    
      //RENDERER
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setSize(window.innerWidth, window.innerHeight);
    
      //CONTROLS + CLOCK
      clock = new THREE.Clock();
      controls = new CameraControls(camera, renderer.domElement);
      controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
      controls.mouseButtons.left = CameraControls.ACTION.TOUCH_ROTATE;
    }
    
    function anim() {
      const delta = clock.getDelta();
      const hasControlsUpdated = controls.update(delta);
    
      requestAnimationFrame(anim);
    
      if (hasControlsUpdated) {
        renderer.render(scene, camera);
      }
    
      render();
    }
    
    function render() {
      followLight.position.copy(camera.position);
    
      //camera.lookAt(new THREE.Vector3(5, 0, -57.33));
    
      renderer.render(scene, camera);
    }
    
    function getAbsolutePosition(mesh, dictPositions) {
      mesh.geometry.computeBoundingBox();
    
      var boundingBox = mesh.geometry.boundingBox;
      var position = new THREE.Vector3();
    
      position.subVectors(boundingBox.max, boundingBox.min);
      position.multiplyScalar(0.5);
      position.add(boundingBox.min);
      position.applyMatrix4(mesh.matrixWorld);
      dictPositions[mesh.name] = position;
    }
    
export default function () {
  return (
    <>
      <VRCanvas sRGB>
        <color attach="background" args={["#171720"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
          <mesh geometry={meshMandible.geometry}>
            <meshStandardMaterial color="0xd3d3d3" />
          </mesh>
      </VRCanvas>
    </>
  )}
