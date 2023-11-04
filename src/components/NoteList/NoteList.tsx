import { useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "../../models";
import { NoteCard } from "../NoteCard/NoteCard";
type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

export const NoteList = ({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState<string>("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] =
    useState<boolean>(false);
  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        (title === "" || note.title.toLowerCase() === title.toLowerCase()) &&
        selectedTags.every((selectedTag) =>
          note.tags.some((noteTag) => noteTag.id === selectedTag.id)
        )
    );
  }, [title, selectedTags, notes]);
  return (
    <>
      <Row className="align-items mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button>Create</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => setEditTagsModalIsOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(val) => setTitle(val.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                isMulti
                options={availableTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                onChange={(tags) =>
                  setSelectedTags(
                    tags.map((tag) => ({ label: tag.label, id: tag.value }))
                  )
                }
                value={selectedTags?.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        availableTags={availableTags}
        show={editTagsModalIsOpen}
        onUpdate={onUpdateTag}
        onDelete={onDeleteTag}
        handleClose={() => setEditTagsModalIsOpen(false)}
      />
    </>
  );
};

type EditTagsModalProps = {
  availableTags: Tag[];
  show: boolean;
  handleClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, label: string) => void;
};

export const EditTagsModal = ({
  availableTags,
  show,
  handleClose,
  onDelete,
  onUpdate,
}: EditTagsModalProps) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdate(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDelete(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
