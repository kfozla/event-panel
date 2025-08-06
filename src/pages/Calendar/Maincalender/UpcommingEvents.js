import React from "react";
import { Card, CardBody } from "reactstrap";

function UpcommingEvents(props) {
  // Etkinlik durumu: Bugün, Gelecek veya Bugün saati geçmiş
  let statusText = "";
  let isPastToday = false;
  let isCurrentTime = false;
  if (props.event.start && props.event.end) {
    const eventStart = new Date(props.event.start);
    const eventEnd = new Date(props.event.end);
    const now = new Date();
    if (
      eventStart.getFullYear() === now.getFullYear() &&
      eventStart.getMonth() === now.getMonth() &&
      eventStart.getDate() === now.getDate()
    ) {
      // Saat hassasiyeti: bugünkü ve saati geçmişse
      if (eventEnd < now) {
        isPastToday = true;
        statusText = "Bugün (Geçmiş Saat)";
      } else if (eventStart <= now && eventEnd >= now) {
        isCurrentTime = true;
        statusText = "Şu An Devam Ediyor";
      } else {
        statusText = "Bugün";
      }
    } else if (eventStart > now) {
      statusText = "Gelecek Tarihli";
    }
  }
  const getTime = (params) => {
    params = new Date(params);
    if (params.getHours() != null) {
      const hour = params.getHours();
      const minute = params.getMinutes() ? params.getMinutes() : "00";
      return hour + ":" + minute;
    }
  };
  const tConvert = (time) => {
    const t = time.split(":");
    var hours = t[0];
    var minutes = t[1];
    var newformat = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + newformat;
  };

  const str_dt_time = function formatDateTime(date) {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const hour = d.getHours().toString().padStart(2, "0");
    const minute = d.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year} ${hour}:${minute}`;
  };

  const category = props.event.className.split("-");
  var endUpdatedDay = "";
  if (props.event.end) {
    endUpdatedDay = new Date(props.event.end);
    var updatedDay = endUpdatedDay.setDate(endUpdatedDay.getDate() - 1);
  }
  var e_dt = updatedDay ? updatedDay : undefined;
  if (e_dt === "Invalid Date" || e_dt === undefined) {
    e_dt = null;
  } else {
    const newDate = new Date(e_dt).toLocaleDateString("en", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    e_dt = new Date(newDate)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .split(" ")
      .join(" ");
  }

  const startDate = props.event.start ? str_dt_time(props.event.start) : "";
  const endDate = props.event.end ? str_dt_time(props.event.end) : "";

  return (
    <Card
      className={`mb-3${
        isPastToday
          ? " bg-danger-subtle"
          : isCurrentTime
          ? " bg-primary-subtle"
          : ""
      }`}
    >
      <CardBody>
        <div className="d-flex mb-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <i
                className={`mdi mdi-checkbox-blank-circle me-2 text-${
                  isPastToday
                    ? "danger"
                    : isCurrentTime
                    ? "primary"
                    : category[1]
                }`}
                style={{ fontSize: "1.1em" }}
              ></i>
              {statusText ? (
                <span
                  className="text-muted"
                  style={{ fontSize: "0.95em", fontWeight: 500 }}
                >
                  {statusText}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <h6 className="card-title fs-16">{props.event.title}</h6>
        <span className="fw-medium d-flex flex-column mb-2">
          <span>{startDate}</span>
          {endDate && startDate !== endDate ? <span>{endDate}</span> : null}
        </span>
        <p className="text-muted text-truncate-two-lines mb-0">
          {props.event.description === "N.A." ? "" : props.event.description}
        </p>
      </CardBody>
    </Card>
  );
}

export default UpcommingEvents;
