# Get CSV Files from PHPP 
PH Navigator (WIP)....


 #### [https://bldgtyp.github.io/ph_navigator/](https://bldgtyp.github.io/ph_navigator/)

# Backend (FastAPI)
#### Setup:
1. `python3.11 -m venv .venv` *(Note: Render.com uses Python3.11, so stick with that)*
1. `source .venv/bin/activate`
1. `pip install -r requirements.txt`
#### Run:
1. `uvicorn backend.main:app --reload`


# Frontend (React)
#### Setup:
1. `npx create-react-app --template typescript`
1. `npm install three`
#### Run:
1. `npm start`


# Deployment as Webservice
1. Make sure origins = [..., "https://bldgtyp.github.io"] is set in [`main.py`](https://github.com/bldgtyp/ph_navigator/blob/main/backend/main.py) to fix CORS
1. Push changes to [GitHub](https://github.com/bldgtyp/ph_navigator)
1. [Render.com](https://render.com/) | Settings:
    - Name: `ph_navigator`
    - Build command: `pip install -r requirements.txt`
    - Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
1. Manually Deployment
1. View the live webservice on [https://ph-navigator.onrender.com/](https://ph-navigator.onrender.com/)
