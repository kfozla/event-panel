import React, { useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import BootstrapTheme from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import { useSelector, useDispatch } from "react-redux";
import { getEvents as onGetEvents } from "../../slices/thunks";
import trLocale from "@fullcalendar/core/locales/tr";

function DashboardCalendar() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.Calendar?.events || []);

  useEffect(() => {
    dispatch(onGetEvents());
  }, [dispatch]);

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
          events={events}
          editable={false}
          droppable={false}
          selectable={false}
          dateClick={undefined}
          eventClick={undefined}
          drop={undefined}
          height={680}
          locales={[trLocale]}
          locale="tr"
        />
      </CardBody>
    </Card>
  );
}

export default DashboardCalendar;
