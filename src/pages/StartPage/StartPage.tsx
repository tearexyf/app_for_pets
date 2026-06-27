import CreateProfile from "../CreateProfile/CreateProfile";
import { getPets } from "../../services/storage";
import PetsList from "../PetsList/PetsList";

function StartPage() {
  const pets = getPets();
  if (pets.length > 0) {
    return <PetsList />;
  }
  return <CreateProfile />;
}

export default StartPage;
