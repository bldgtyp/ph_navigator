// Passive-House Navigator Application

import './styles/App.css';
import theme from "./styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import Team from './components/Team';

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Start the App
function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path=":teamId/*" element={<Team />} />
        </Routes>
      </ThemeProvider>
    </Router >
  );
}

export default App;