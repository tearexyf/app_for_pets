import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreateTask from "../pages/CreateTask/CreateTask";
import StartPage from "../pages/StartPage/StartPage";
import Home from "../pages/Home/Home";
import CreateProfile from "../pages/CreateProfile/CreateProfile";
import PetProfile from "../pages/PetProfile/PetProfile";
import Calendar from "../pages/Calendar/Calendar";
import Setting from "../pages/Setting/Setting";
import GalleryHub from "../pages/Gallery/GalleryHub";
import PetGallery from "../pages/Gallery/PetGallery";
import EditProfile from "../pages/EditProfile/EditProfile";

function RouterMy() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pet-profile" element={<PetProfile />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/gallery" element={<GalleryHub />} />
        <Route path="/gallery/:petId" element={<PetGallery />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/create-pet" element={<CreateProfile />} />
        <Route path="/edit-profile" element={<EditProfile/>}/>
        <Route path="*" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterMy;
