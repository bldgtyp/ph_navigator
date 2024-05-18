# PH Navigator (WIP)

#### [https://bldgtyp.github.io/ph_navigator/](https://bldgtyp.github.io/ph_navigator/)


## TODO:

#### Bugs:
- [X] Check Exterior Construction API Calls (circular)?
- [X] Check the Polyline3D Geometry errors

#### Deployment:
- [X] Create WebService 
- [X] Test Deployment to Render.com

#### Get Geometry:
- [X] Add Ground Plane
- [X] Windows & Material
- [X] Get Boundary Condition
- [X] Get HB-Construction Name and Props
- [X] Get Outdoor Shades
- [X] Refactor Poly-lines so material gets set in Viewer/useEffect
- [X] Spaces
  - [X] Spaces need to be Rotated in hp-ph
- [ ] Thermal Bridge Edges
- [ ] Winter / Summer Window Radiation Grid and Legend
- [ ] add north arrow and north text to sunpath
- [ ] Get Doors

#### Get Systems:
- [ ] Ventilation
  - [X] Ducting
  - [ ] ERV unit
- [ ] Plumbing
  - [X] Piping
  - [ ] Hot Water Tanks and Heaters (note: need to add geom to HBPH / GH)

#### UI:
- [X] Refactor App-State and Mouse-Events
   - [X] State as Enum? 'State' Pattern?
- [X] Add all app-state event listeners
- [X] Fix Measurement Vertex Selector behavior. Super jankey right now.
  - [X] Try: [webgl_interactive_points](https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_points.html)
- [X] move the face data panel to the left
- [X] add 'results' buttons on the right
- [X] Refactor App State to useReducer / useContext
- [X] Refactor AppState to Custom-Context
  - [X] Review: [https://youtu.be/I7dwJxGuGYQ?si=86COoEbLIl_Vejom](https://youtu.be/I7dwJxGuGYQ?si=86COoEbLIl_Vejom)
- [X] Refactor Selected-Object to useReducer / useContext / Custom-Context
- [X] Refactor Dimension-Lines to useReducer / useContext / Custom-Context
- [X] Add PH status bar on the RIGHT-SIDE with the results and indicator red/green check marks for heat-demand, etc...
- [X] Select Rooms, display room-data in panel on left side
- [X] Add Sun-path diagram State
  - [ ] Time of Day control (connect to sunlight position)
- [X] add a u-value list with sliders to the face data panel 
  - [X] Make exterior surfaces only
  - [ ] Add a Window U-Value section below
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
- [ ] Fix so that clicks on the dialogue windows don't become clicks in THREE.js
- [ ] When selecting a surface for query - show all the edge dims in very light text
- [ ] Move results to top to allow for app-state bar to the right
- [ ] When selecting a pipe, show the dims alongside
- [ ] Add Loading modal dialogs
  - [ ] Browser Project Loading
  - [ ] Model Faces Load

#### NavBar:
- [X] Add 'home' icon on left side (Navigator)
- [X] Make so project cannot be selected from the dropdown, only the home page
- [X] Create new Model Upload dialogue and endpoint
- [ ] Add model source url
- [ ] Fix EPW file data source. Location in upper right (map link)
- [ ] Add model refresh button

#### Comments 
- [ ] Create new honeybee-tracker plugin
- [ ] Add 'comments' storage to all relevant honeybee-objects `.properties`
- [ ] Integrate comments library into ph-navigator
   - [ ] Try: [react-chat-window](https://www.npmjs.com/package/react-chat-window?activeTab=readme)

#### Scene:
- [X] Add Shadows on Ground Plane
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
- [X] Create Pydantic Response Models
- [X] Refactor all API endpoints to use Pydantic Models
- [X] Re-write the other endpoints (spaces, pipes, etc..) with Pydantic
- [ ] Move file paths into config file
- [ ] Add some form of basic Auth



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
