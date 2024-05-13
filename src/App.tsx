// Passive-House Navigator Application

import './styles/App.css';
import theme from "./styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Routes, useParams } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import Team from './components/Team';
import Public from './components/Public';

function TeamRoute() {
  const { teamId } = useParams();

  if (teamId === 'public') {
    return <Public />;
  }
  return <Team />;
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Start the App
function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path=":teamId/*" element={<TeamRoute />} />
        </Routes>
      </ThemeProvider>
    </Router >
  );
}

export default App;