import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Message from './components/SideContent/messages'
import DashboardLayout from "./components/DashboardLayout";
import { GlobalStyles } from "./lib/styled-component/globalStyles";

function App() {
  return (
    <div>
      <GlobalStyles />
      <Routes>
        <Route element={<Layout />}>
          <Route path="profile" element={<Profile />} />

          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Message/>}/>
            <Route path="mention" element={<h1>This is the mention</h1>}/>
            <Route path="request" element={<h1>This is the request</h1>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
