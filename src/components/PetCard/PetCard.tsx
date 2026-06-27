import type { Pet } from "../../types/Pet";
import { useFormatWeight } from "../../hooks/useFormatWeight";
import "./PetCard.css";

export interface PetCardProps {
  pet: Pet;
}

function PetCard({ pet }: PetCardProps) {
  const { formatWeight } = useFormatWeight();

  return (
    <div className="petCard">
      {pet.photo && (
        <img className="petCard__photo" src={pet.photo} alt="pet" />
      )}

      <h1 className="petCard__name">{pet.name}</h1>

      <p className="petCard__p">{pet.species}</p>

      <p className="petCard__p">{pet.breed}</p>

      {pet.weight && (
        <p className="petCard__p">{formatWeight(pet.weight)}</p>
      )}

      <p className="petCard__p">{pet.notes}</p>
    </div>
  );
}

export default PetCard;
