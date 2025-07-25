import React from "react";
import { Container } from "reactstrap";
import Section from "./Section";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const ProjectOverview = () => {
  document.title =
    "Project Overview | Velzon - React Admin & Dashboard Template";
  const { id } = useParams();
  const [eventId, setEventId] = React.useState(id);

  useEffect(() => {
    setEventId(id);
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Section eventId={eventId} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProjectOverview;
