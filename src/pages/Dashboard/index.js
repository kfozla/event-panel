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
import { getPanelUserEvents } from "../../api/panelUser";
import { set } from "lodash";

const DashboardProject = () => {
  document.title = "Projects | Velzon - React Admin & Dashboard Template";
  const [events, setEvents] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);

  // Eventlerin tarihine göre className belirle
  const getCalendarDataFromEvents = (events) => {
    const now = new Date();
    return events.map((event) => {
      const start = new Date(event.startTime);
      let className = "bg-success-subtle"; // ileri tarihli: yeşil
      if (
        start.getFullYear() === now.getFullYear() &&
        start.getMonth() === now.getMonth() &&
        start.getDate() === now.getDate()
      ) {
        className = "bg-primary-subtle"; // aynı gün: mavi
      } else if (start < now.setHours(0, 0, 0, 0)) {
        className = "bg-danger-subtle"; // geçmiş: kırmızı
      }
      const calendarEvent = {
        id: event.id,
        title: event.name,
        start,
        end: new Date(event.endTime),
        allDay: false,
        className,
      };
      if (event.panelUser && event.panelUser.username) {
        calendarEvent.panelUserUsername = event.panelUser.username;
      }
      return calendarEvent;
    });
  };

  const [calendarData, setCalendarData] = React.useState([]);

  React.useEffect(() => {
    setCalendarData(getCalendarDataFromEvents(events));
  }, [events]);

  // Eventlerden chartData üret (her yıl için 12 aylık dizi)
  const getChartDataFromEvents = (events) => {
    const yearMap = {};
    events.forEach((event) => {
      const date = new Date(event.startTime);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      if (!yearMap[year]) yearMap[year] = Array(12).fill(0);
      yearMap[year][month]++;
    });
    return Object.entries(yearMap).map(([year, monthsArr]) => ({
      name: "Etkinlik Sayısı",
      type: "bar",
      data: monthsArr,
      year: Number(year),
    }));
  };
  const [authUser, setAuthUser] = React.useState(null);
  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("authUser"));
    if (user) {
      setAuthUser(user);
    }
  }, []);
  // Fetch events data ve chartData'yı güncelle
  React.useEffect(() => {
    if (!authUser) return;
    const fetchEvents = async () => {
      try {
        let response;
        if (authUser.role === "Admin") {
          response = await getEvents();
        } else {
          response = await getPanelUserEvents();
        }
        console.log("Fetched events:", response.data);
        setEvents(response.data);
        setChartData(getChartDataFromEvents(response.data));
        setCalendarData(getCalendarDataFromEvents(response.data));
        console.log("Fetched events:", response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [authUser]);
  console.log("Chart Data:", chartData);
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
              <ProjectsOverview tabloData={chartData} />
            </Col>
            <Col xxl={4}>
              <Label className="h5 mb-3">Takvim</Label>
              <DashboardCalendar calendarData={calendarData} />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardProject;
