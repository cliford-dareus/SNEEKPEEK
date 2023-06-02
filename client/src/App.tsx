import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Message from "./components/SideContent/messages";
import Mention from "./components/SideContent/mentions";
import Request from "./components/SideContent/request";
import DashboardLayout from "./components/DashboardLayout";
import { GlobalStyles } from "./lib/styled-component/globalStyles";

function App() {
  return (
    <div>
      <GlobalStyles />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Message />} />
            <Route path="mention" element={<Mention />} />
            <Route path="request" element={<Request />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
