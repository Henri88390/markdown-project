import { Navigate, Outlet, useParams } from "react-router-dom";
import { Note } from "../../models";
type NoteLayoutProps = {
  notes: Note[];
};
export const NoteLayout = ({ notes }: NoteLayoutProps) => {
  const { id } = useParams();
  const note = notes.find((note) => note.id === id);

  if (note === null) return <Navigate to="/" replace></Navigate>;
  return <Outlet context={note} />;
};
