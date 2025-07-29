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
      return {
        id: event.id,
        title: event.name,
        start,
        end: new Date(event.endTime),
        allDay: false,
        className,
      };
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

  // Fetch events data ve chartData'yı güncelle
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response);
        setChartData(getChartDataFromEvents(response));
        setCalendarData(getCalendarDataFromEvents(response));
        console.log("Fetched events:", response);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);
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
