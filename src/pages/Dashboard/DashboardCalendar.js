import React, { useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import BootstrapTheme from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import { useSelector, useDispatch } from "react-redux";
import { getEvents as onGetEvents } from "../../slices/thunks";
import trLocale from "@fullcalendar/core/locales/tr";

import { useNavigate } from "react-router-dom";

function DashboardCalendar({ calendarData }) {
  const navigate = useNavigate();

  // Event tıklanınca overview sayfasına yönlendir
  const handleEventClick = (info) => {
    const eventId = info.event.id;
    navigate(`/apps-events-overview/${eventId}`);
  };

  return (
    <Card className="card-h-100">
      <CardBody>
        <FullCalendar
          plugins={[BootstrapTheme, dayGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          slotDuration={"00:15:00"}
          handleWindowResize={true}
          themeSystem="bootstrap"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
          }}
          events={calendarData}
          editable={false}
          droppable={false}
          selectable={false}
          eventClick={handleEventClick}
          height={680}
          locales={[trLocale]}
          locale="tr"
        />
      </CardBody>
    </Card>
  );
}

const style = document.createElement("style");
style.innerHTML = `.fc-event { cursor: pointer !important; }`;
document.head.appendChild(style);

export default DashboardCalendar;
