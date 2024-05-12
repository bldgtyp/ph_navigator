// Passive-House Navigator Application

import './styles/App.css';
import theme from "./styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import Project from './components/Project';


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Start the App
function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path=":projectId/:modelId/" element={<Project />} />
        </Routes>
      </ThemeProvider>
    </Router >
  );
}

export default App;