import numpy as np
import pywavefront
import pythreejs as p3
from IPython.display import display

# Load an .obj file with pywavefront
obj_url = 'black_bird.mtl'
scene = pywavefront.Wavefront(obj_url, collect_faces=True)

# Extract vertices and faces
vertices = np.array(scene.vertices, dtype=np.float32)
faces = np.array([face for mesh in scene.mesh_list for face in mesh.faces], dtype=np.uint16).flatten()

# Create buffer geometry
geometry = p3.BufferGeometry(
    attributes={
        'position': p3.BufferAttribute(vertices, normalized=False),
        'index': p3.BufferAttribute(faces, normalized=False)
    }
)

# Create a material
material = p3.MeshStandardMaterial(color='red', side='DoubleSide')

# Create a mesh
threejs_mesh = p3.Mesh(geometry=geometry, material=material)

# Create a scene
scene = p3.Scene(children=[threejs_mesh, p3.AmbientLight(color='#cccccc')])

# Create a camera
camera = p3.PerspectiveCamera(position=[0, 0, 10], fov=75)

# Create a renderer
renderer = p3.Renderer(camera=camera, scene=scene, controls=[p3.OrbitControls(controlling=camera)])

# Display the renderer
display(renderer)
