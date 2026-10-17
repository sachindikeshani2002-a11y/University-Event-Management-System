import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Send } from "lucide-react";
import OrganizerLayout from "../components/OrganizerLayout";
import { useOrganizer } from "../context/OrganizerContext";
import "./CreateEvent.css";

const blankForm = {
  title: "",
  description: "",
  category: "Technology",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  maxParticipants: "",
  registrationDeadline: "",
  status: "Draft",
};

function CreateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizerEvents, addEvent, updateEvent, isLoadingEvents } = useOrganizer();
  const editingEvent = id ? organizerEvents.find((event) => String(event.id) === id) : null;
  const [formData, setFormData] = useState(() => editingEvent ? {
    ...blankForm,
    ...editingEvent,
    maxParticipants: editingEvent.maxParticipants ? String(editingEvent.maxParticipants) : "",
  } : blankForm);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isEditing = Boolean(id);

  if (isEditing && isLoadingEvents) return <OrganizerLayout><div className="organizer-page" role="status">Loading event...</div></OrganizerLayout>;
  if (isEditing && !editingEvent) return <Navigate to="/organizer/events" replace />;

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestedStatus = event.nativeEvent.submitter?.value;
    const status = requestedStatus || formData.status || "Pending";
    const formattedTime = `${new Date(`1970-01-01T${formData.startTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${new Date(`1970-01-01T${formData.endTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    const values = {
      ...formData,
      maxParticipants: Number(formData.maxParticipants) || 0,
      registrationDeadline: formData.registrationDeadline || formData.date,
      time: formattedTime,
      status,
    };

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      if (isEditing) {
        await updateEvent(id, values);
        setFeedback("Event changes saved and submitted for approval.");
      } else {
        await addEvent(values);
        setFeedback(status === "Draft" ? "Event saved as a draft." : "Event submitted for approval.");
        setFormData(blankForm);
      }
    } catch (error) {
      setErrorMessage(error.message || "Unable to save the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OrganizerLayout>
      <div className="organizer-page">
        <header className="organizer-page-header">
          <div><Link className="organizer-back-link" to="/organizer/events"><ArrowLeft size={14} /> My Events</Link><span className="organizer-eyebrow">EVENT MANAGEMENT</span><h1>{isEditing ? "Edit Event" : "Create Event"}</h1><p>{isEditing ? "Update the event details below." : "Add an event to the university calendar."}</p></div>
        </header>

        {feedback && <div className="organizer-feedback" role="status">{feedback}{!isEditing && <Link className="organizer-feedback-link" to="/organizer/events">View My Events</Link>}</div>}
        {errorMessage && <div className="organizer-feedback" role="alert">{errorMessage}</div>}

        <section className="organizer-card organizer-form-card">
          <form onSubmit={handleSubmit}>
            <div className="organizer-form-grid">
              <div className="organizer-form-field full-width"><label htmlFor="event-title">Event title <span>*</span></label><input className="organizer-input" id="event-title" name="title" value={formData.title} onChange={updateField} required maxLength={120} placeholder="e.g. University Innovation Forum" /></div>
              <div className="organizer-form-field full-width"><label htmlFor="event-description">Description <span>*</span></label><textarea className="organizer-textarea" id="event-description" name="description" value={formData.description} onChange={updateField} required maxLength={1000} placeholder="Describe the event and what attendees can expect." /></div>
              <div className="organizer-form-field"><label htmlFor="event-category">Category <span>*</span></label><select className="organizer-input" id="event-category" name="category" value={formData.category} onChange={updateField} required><option>Technology</option><option>Workshops</option><option>Career</option><option>Academic</option><option>Community</option><option>Leadership</option><option>Other</option></select></div>
              <div className="organizer-form-field"><label htmlFor="event-date">Date <span>*</span></label><input className="organizer-input" id="event-date" name="date" type="date" value={formData.date} onChange={updateField} required /></div>
              <div className="organizer-form-field"><label htmlFor="event-start">Start time <span>*</span></label><input className="organizer-input" id="event-start" name="startTime" type="time" value={formData.startTime} onChange={updateField} required /></div>
              <div className="organizer-form-field"><label htmlFor="event-end">End time <span>*</span></label><input className="organizer-input" id="event-end" name="endTime" type="time" value={formData.endTime} onChange={updateField} required /></div>
              <div className="organizer-form-field full-width"><label htmlFor="event-location">Location <span>*</span></label><input className="organizer-input" id="event-location" name="location" value={formData.location} onChange={updateField} required maxLength={140} placeholder="Building, room, or online venue" /></div>
              <div className="organizer-form-field"><label htmlFor="event-capacity">Maximum participants</label><input className="organizer-input" id="event-capacity" name="maxParticipants" type="number" min="1" value={formData.maxParticipants} onChange={updateField} placeholder="e.g. 150" /></div>
              <div className="organizer-form-field"><label htmlFor="event-deadline">Registration deadline</label><input className="organizer-input" id="event-deadline" name="registrationDeadline" type="date" value={formData.registrationDeadline} onChange={updateField} /></div>
              <div className="organizer-form-field"><label htmlFor="event-status">Submission status</label><select className="organizer-input" id="event-status" name="status" value={formData.status === "Draft" ? "Draft" : "Pending"} onChange={updateField}><option value="Draft">Draft</option><option value="Pending">Submit for approval</option></select></div>
            </div>
            <div className="organizer-form-actions">
              <button className="organizer-button secondary" type="button" onClick={() => navigate("/organizer/events")}>Cancel</button>
              {!isEditing && <button className="organizer-button secondary" type="submit" value="Draft" disabled={isSubmitting}><Check size={15} />Save as Draft</button>}
              <button className="organizer-button" type="submit" value={isEditing ? (formData.status === "Draft" ? "Draft" : "Pending") : "Pending"} disabled={isSubmitting}><Send size={15} />{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Submit for Approval"}</button>
            </div>
          </form>
        </section>
      </div>
    </OrganizerLayout>
  );
}

export default CreateEvent;
