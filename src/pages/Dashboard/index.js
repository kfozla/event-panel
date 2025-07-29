import React from "react";
import { Col, Container, Label, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import ActiveProjects from "./ActiveProjects";
import Chat from "./Chat";
import MyTasks from "./MyTasks";
import ProjectsOverview from "./ProjectsOverview";
import ProjectsStatus from "./ProjectsStatus";
import TeamMembers from "./TeamMembers";
import UpcomingSchedules from "./UpcomingSchedules";
import Widgets from "./Widgets";
import DashboardCalendar from "./DashboardCalendar";
import { getEvents } from "../../api/events";

const DashboardProject = () => {
  document.title = "Projects | Velzon - React Admin & Dashboard Template";
  const [events, setEvents] = React.useState([]);
  // Fetch events data
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response);
        console.log("Fetched events:", response);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Etkinlikler" pageTitle="Kontrol Paneli" />
          <Row className="project-wrapper">
            <Col xxl={8}>
              {(() => {
                const now = new Date();
                return (
                  <Widgets
                    eventCount={events.length}
                    upcomingEventCount={
                      events.filter((event) => new Date(event.startTime) > now)
                        .length
                    }
                    pastEventCount={
                      events.filter((event) => new Date(event.startTime) < now)
                        .length
                    }
                  />
                );
              })()}
              <ProjectsOverview />
            </Col>
            <Col xxl={4}>
              <Label className="h5 mb-3">Takvim</Label>
              <DashboardCalendar />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardProject;
