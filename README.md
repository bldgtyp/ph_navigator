# PH Navigator (WIP)
![Screenshot 2024-05-29 at 1 53 04 PM](https://github.com/bldgtyp/ph_navigator/assets/69652712/787acbb2-5f32-4805-b1cd-d3846d910f8a)

#### [https://bldgtyp.github.io/ph_navigator/#/bldgtyp](https://bldgtyp.github.io/ph_navigator/#/bldgtyp)


## TODO:

#### Get Geometry:
- [ ] Thermal Bridge Edges
- [ ] Winter / Summer Window Radiation Grid and Legend
- [ ] Add north arrow and north text to sunpath
- [ ] Add persistent North arrow someplace (for non-shading views)
- [ ] Get Doors
- [ ] iCFA / Geometry Outlines using 'boundary' don't work for donut shapes. Shift to use edge-helper like on shading meshes
- [ ] Property Lines, curb/street edges, street-name / label
- [ ] Adjacent buildings as semi-opaque somehow?

#### Get Systems:
- [ ] Ventilation
  - [X] Ducting 
  - [ ] ERV unit (note: need to add geom to HBPH / GH)
- [ ] Plumbing
  - [X] Piping
  - [ ] Hot Water Tanks and Heaters (note: need to add geom to HBPH / GH)

#### UI:
- [X] Add Sun-path diagram State
  - [ ] Time of Day control (connect to sunlight position)
- [ ] Adjustable clipping plane (vertical adjustment at least, to see levels)
- [ ] Update selectable objects with vis-state

#### Tables:
- [ ] Windows Table (frames, glass, units)
- [ ] Constructions Table (with Materials)
- [ ] Searchable
- [ ] add a u-value list with sliders to the face data panel 
  - [ ] Add a Window U-Value section below

#### Dimensions:
- [ ] Add 'escape' to clear current dimension
- [ ] Add rubber-band line
- [ ] Add 'first vertex' persistent marker
- [ ] Add guard against 0-length markers
- [ ] Add new option to select face, show face-id/name and aut-dimension all edges

#### Selection:
- [ ] When selecting a surface for query - show all the edge-dims in very light text
- [ ] Multiple Object Select (reflected in object properties panel)
- [ ] LMB crossing box to select
- [ ] ctrl-LMB (Windows Style)?
- [ ] Plumbing Pipes
  - [ ] When selecting, show the dims alongside
- [ ] Ventilation Ducting
- [ ] LMB select in negative space to de-select
- [ ] Add 'escape' to clear surface select

#### Object Properties Panel:
- [ ] Face Data - truncate names / identifiers
- [ ] Don't like constant opening/closing. 
- [ ] Should have option to close
- [ ] Tighten up text fields. Too much spacing

#### Color by:
- [ ] Boundary Condition
- [ ] Assembly Type
- [ ] TFA Factor
- [ ] Ventilation (sup/eta)

#### Search Panel:
- [ ] Select Similar to current selection
- [ ] By boundary-condition type
- [ ] By surface/object type
- [ ] By Construction Type
- [ ] By Name / Prefix 

#### NavBar:
- [ ] Fix EPW file data source. Location in upper right (map link)
- [ ] Add model refresh button

#### Comments 
- [ ] Create new honeybee-tracker plugin
- [ ] Add 'comments' storage to all relevant honeybee-objects `.properties`
- [ ] Integrate comments library into ph-navigator
  - [ ] Try: [react-chat-window](https://www.npmjs.com/package/react-chat-window?activeTab=readme)

#### Scene:
- [ ] Auto-bounds (ground, shadows) based on loaded geometry size:
  - [ ] grid
  - [ ] lights
  - [ ] camera location
  - [ ] shadow map
- [ ] Camera 'reset' button someplace
- [ ] Intentionally ignore coincident face display conflict (ground)
- [ ] Add default 'pan/rotate' tool-state

#### API & Data Storage:
- [ ] Add some form of basic Auth

#### Export:
- [x] JSON
  -  Add 'Download' icon, not just link icon 
- [ ] CSV
- [ ] Download


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
