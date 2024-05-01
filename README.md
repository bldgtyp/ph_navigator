# PH Navigator (WIP)

#### [https://bldgtyp.github.io/ph_navigator/](https://bldgtyp.github.io/ph_navigator/)


## TODO:
#### Deployment:
- [ ] Create Docker Image or WebService? 
- [ ] Test Deployment to Render.com

#### Geometry:
- [x] Add Ground Plane
- [x] Windows & Material
- [x] Get Boundary Condition
- [x] Get HB-Construction Name and Props
- [ ] Get Outdoor Shades
- [ ] Get Doors
- [x] Spaces
- [ ] Thermal Bridge Edges
- [ ] Winter / Summer Window Radiation Grid and Legend
- [ ] add north arrow and north text to sunpath
- [ ] Refactor Poly-lines so material gets set in Viewer/useEffect

#### Systems:
- [ ] Ventilation Ducting
- [ ] Ventilation Equipment
- [ ] Plumbing Piping
- [ ] Hot Water Tanks and Heaters

#### UI:
- [x] Refactor App-State and Mouse-Events
   - [x] State as Enum? 'State' Pattern?
- [x] Add all app-state event listeners
- [x] Fix Measurement Vertex Selector behavior. Super jankey right now.
  - [x] Try: [webgl_interactive_points](https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_points.html)
- [x] Add Sun-path diagram State
  - [ ] Time of Day control (connect to sunlight position)
- [ ] Face Data - truncate names / identifiers
- [ ] Constructions Table (with Materials)
- [ ] Windows Table (frames, glass, units)
- [ ] Surface select should not drop on scene rotate or pan
- [ ] Add 'escape' to clear surface select
- Dimensions:
  - [ ] Add 'escape' to clear current dimension
  - [ ] Add rubber-band line
  - [ ] Add 'first vertex' persistent marker
  - [ ] Add guard against 0-length markers
  - [ ] Add new option to select face, show face-id/name and aut-dimension all edges
- [ ] Adjustable clipping plane (vertical adjustment at least, to see levels)
- [x] move the face data panel to the left
- [ ] add 'results' buttons on the right
- [x] add a u-value list with sliders to the face data panel 
  - [x] Make exterior surfaces only
  - [ ] Add a Window U-Value section below
- [x] Refactor App State to useReducer / useContext
- [ ] Refactor Selected-Object to useReducer / useContext
- [ ] Refactor Dimension-Lines to useReducer / useContext
- [ ] Fix so that clicks on the dialogue windows don't become clicks in THREE.js
- [ ] Add PH status bar on the top with red/green check marks for heat-demand, etc...


#### Comments 
- [ ] Create new honeybee-tracker plugin
- [ ] Add 'comments' storage to all relevant honeybee-objects `.properties`
- [ ] Integrate comments library into ph-navigator
   - [ ] Try: [react-chat-window](https://www.npmjs.com/package/react-chat-window?activeTab=readme)

#### Scene:
- [x] Add Shadows on Ground Plane
- [ ] AO shadows
- [ ] Auto-bounds based on loaded geometry:
  - [ ] grid
  - [ ] lights
  - [ ] camera location
  - [ ] shadow map

#### API:
- [ ] Create Pydantic Response Models
- [ ] Refactor all API endpoints to use Pydantic Models
- [ ] Move file paths into config file


# Backend Setup (FastAPI)
#### Setup:
1. `python3.11 -m venv .venv` *(Note: Render.com uses Python3.11, so stick with that)*
1. `source .venv/bin/activate`
1. `pip install -r requirements.txt`
#### Run:
1. `uvicorn backend.main:app --reload`


# Frontend Setup (React)
#### Setup:
1. `npx create-react-app --template typescript`
1. `npm install three`
#### Run:
1. `npm start`


# Deployment as Web-service
1. Make sure origins = [..., "https://bldgtyp.github.io"] is set in [`main.py`](https://github.com/bldgtyp/ph_navigator/blob/main/backend/main.py) to fix CORS
1. Push changes to [GitHub](https://github.com/bldgtyp/ph_navigator)
1. [Render.com](https://render.com/) | Settings:
    - Name: `ph_navigator`
    - Build command: `pip install -r requirements.txt`
    - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
1. Manually Deployment
1. View the live web-service on [https://ph-navigator.onrender.com/](https://ph-navigator.onrender.com/)
