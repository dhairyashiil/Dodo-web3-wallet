import Link from "next/link";
import Image from "next/image";
import { DraggableCardDemo } from "./DraggableCard";

export default function Collectibles() {
  return (
    <div className="my-10 p-10 rounded-lg" style={{ backgroundColor: "" }}>
      <DraggableCardDemo />
    </div>
  );
}
