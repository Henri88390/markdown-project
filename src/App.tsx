import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import styles from "./App.module.scss";
import { EditNote, NewNote, Note, NoteList } from "./components";
import { NoteLayout } from "./components/NoteLayout/NoteLayout";
import { useLocalStorage } from "./hooks";
import { NoteData, Tag } from "./models";
import { RawNote } from "./models/NoteModel";

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);
  const navigate = useNavigate();

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
    navigate("/");
  };
  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
          };
        } else {
          return note;
        }
      });
    });
    navigate("/");
  };

  const onDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const addTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const updateTag = (id: string, label: string) => {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return {
            ...tag,
            label,
          };
        } else {
          return tag;
        }
      });
    });
    navigate("/");
  };

  const deleteTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <div className={styles["container"]}>
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTag}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
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
        <Route path="/:id" element={<NoteLayout notes={notesWithTag} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
