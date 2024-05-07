# PH Navigator (WIP)

#### [https://bldgtyp.github.io/ph_navigator/](https://bldgtyp.github.io/ph_navigator/)


## TODO:

#### Bugs:
- [x] Check Exterior Construction API Calls (circular)?
- [x] Check the Polyline3D Geometry errors

#### Deployment:
- [x] Create WebService 
- [x] Test Deployment to Render.com

#### Get Geometry:
- [x] Add Ground Plane
- [x] Windows & Material
- [x] Get Boundary Condition
- [x] Get HB-Construction Name and Props
- [ ] Get Outdoor Shades
- [ ] Get Doors
- [x] Spaces
  - [x] Spaces need to be Rotated in hp-ph
- [ ] Thermal Bridge Edges
- [ ] Winter / Summer Window Radiation Grid and Legend
- [ ] add north arrow and north text to sunpath
- [ ] Refactor Poly-lines so material gets set in Viewer/useEffect

#### Get Systems:
- [ ] Ventilation
  - [x] Ducting
  - [ ] ERV unit
- [ ] Plumbing
  - [x] Piping
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
- [ ] Dimensions:
  - [ ] Add 'escape' to clear current dimension
  - [ ] Add rubber-band line
  - [ ] Add 'first vertex' persistent marker
  - [ ] Add guard against 0-length markers
  - [ ] Add new option to select face, show face-id/name and aut-dimension all edges
- [ ] Adjustable clipping plane (vertical adjustment at least, to see levels)
- [x] move the face data panel to the left
- [x] add 'results' buttons on the right
- [x] add a u-value list with sliders to the face data panel 
  - [x] Make exterior surfaces only
  - [ ] Add a Window U-Value section below
- [x] Refactor App State to useReducer / useContext
- [ ] Refactor to Custom-Context
  - [ ] Review: [https://youtu.be/I7dwJxGuGYQ?si=86COoEbLIl_Vejom](https://youtu.be/I7dwJxGuGYQ?si=86COoEbLIl_Vejom)
- [ ] Refactor Selected-Object to useReducer / useContext
- [ ] Refactor Dimension-Lines to useReducer / useContext
- [ ] Fix so that clicks on the dialogue windows don't become clicks in THREE.js
- [x] Add PH status bar on the RIGHT-SIDE with the results and indicator red/green check marks for heat-demand, etc...
- [ ] Select Rooms, display room-data in panel on left side

#### Comments 
- [ ] Create new honeybee-tracker plugin
- [ ] Add 'comments' storage to all relevant honeybee-objects `.properties`
- [ ] Integrate comments library into ph-navigator
   - [ ] Try: [react-chat-window](https://www.npmjs.com/package/react-chat-window?activeTab=readme)

#### Scene:
- [x] Add Shadows on Ground Plane
- [ ] AO Shadows Pass?
- [ ] Add Outline Pass?
  - [ ] Review: [https://youtu.be/1wiv3kF78Go?si=HpYGNYy6lxgoSj43](https://youtu.be/1wiv3kF78Go?si=HpYGNYy6lxgoSj43)
  - [ ] Review: [https://youtu.be/AUJlkwLiciw?si=_bRL6HXfUnFkBG0s](https://youtu.be/AUJlkwLiciw?si=_bRL6HXfUnFkBG0s)
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
1. Set `./tsconfig.json` "target": "es6",`
1. `npm install three`

#### Run Locally:
1. Make sure `./.env.development.local` includes:
	- `"REACT_APP_API_URL=http://localhost:8000"`
1. `npm start`
1. View at [http://localhost:3000]()

# Deploy to GitHub Pages:
1. `src/data/constants.json` includes:
	- `"RENDER_API_BASE_URL": "https://ph-navigator.onrender.com/"`
1. `./package.json` includes:
	- `"name": "ph_navigator"`
	- `"homepage": "https://ph-tools.github.io/ph_navigator/"`
1. Setup `deploy_app.yml` file in `./.github/workflows`
1. Deployed to GitHub Pages at: https://ph-tools.github.io/ph_navigator/


# Deployment as Web-service

1. Make sure origins = [..., "https://bldgtyp.github.io"] is set in [`main.py`](https://github.com/bldgtyp/ph_navigator/blob/main/backend/main.py) to fix CORS
1. Push changes to [GitHub](https://github.com/bldgtyp/ph_navigator)
1. [Render.com](https://render.com/) | Settings:
    - Name: `ph_navigator`
    - Build command: `pip install -r requirements.txt`
    - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
1. Manually Deployment
1. View the live web-service on [https://ph-navigator.onrender.com/](https://ph-navigator.onrender.com/)
