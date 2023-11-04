import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { v4 as uuid } from "uuid";
import styles from "./App.module.scss";
import { NewNote } from "./components";
import { useLocalStorage } from "./hooks";
import { NoteData, Tag } from "./models";
import { RawNote } from "./models/NoteModel";

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTag = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
    }));
  }, [notes, tags]);

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => [
      ...prevNotes,
      { ...data, id: uuid(), tagIds: tags.map((tag) => tag.id) },
    ]);
  };

  const addTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  return (
    <div className={styles["container"]}>
      <Routes>
        <Route path="/" element={<div>Caca.</div>} />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id">
          <Route index element={<div>Show</div>} />
          <Route path="edit" element={<div>edit</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
