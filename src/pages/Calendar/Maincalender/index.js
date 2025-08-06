import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
//Import Icons
import FeatherIcon from "feather-icons-react";

import {
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import Flatpickr from "react-flatpickr";
import listPlugin from "@fullcalendar/list";

//redux
import { useSelector, useDispatch } from "react-redux";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

//Simple bar
import SimpleBar from "simplebar-react";
import UpcommingEvents from "./UpcommingEvents";

import {
  getEvents as onGetEvents,
  getCategories as onGetCategories,
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  updateEvent as onUpdateEvent,
  resetCalendar,
} from "../../../slices/thunks";
import { createSelector } from "reselect";

import { getPanelUserRandevular } from "../../../api/panelUser";
import {
  updateRandevu,
  deleteRandevu,
  createRandevu,
  getAllRandevular,
} from "../../../api/randevu";
import trLocale from "@fullcalendar/core/locales/tr";
import { set } from "lodash";

const Calender = () => {
  const dispatch = useDispatch();
  const [event, setEvent] = useState({});
  // Modal state'leri
  const [addModal, setAddModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedNewDay, setSelectedNewDay] = useState(0);
  const [upcommingevents, setUpcommingevents] = useState([]);
  const [isEditButton, setIsEditButton] = useState(true);

  const [randevular, setRandevular] = useState([]);
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, []); // sadece mount'ta çalışır

  useEffect(() => {
    if (!authUser || !authUser.id) return;
    const fetchRandevular = async () => {
      try {
        const response = await getPanelUserRandevular(authUser.id);
        setRandevular(response);
      } catch (error) {
        console.error("Error fetching randevular:", error);
      }
    };

    fetchRandevular();
  }, [authUser.id]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    if (randevular && randevular.length > 0) {
      const now = new Date();
      now.setSeconds(0, 0);
      const mapped = randevular.map((r) => {
        const startDate = new Date(r.start);
        const endDate = new Date(r.end);
        let className = "";
        if (endDate < now) {
          className = "bg-danger-subtle text-danger"; // geçmiş
        } else if (startDate <= now && endDate >= now) {
          className = "bg-primary-subtle text-primary"; // şu an devam eden
        } else if (startDate > now) {
          className = "bg-success-subtle text-success"; // gelecek
        } else {
          className = "bg-secondary-subtle text-secondary"; // fallback
        }
        return {
          id: r.id,
          title: r.name,
          start: r.start,
          end: r.end,
          description: r.description,
          className,
        };
      });
      setCalendarEvents(mapped);
    }
  }, [randevular]);

  const selectLayoutState = (state) => state.Calendar;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (calender) => ({
      events: calender?.events,
      categories: calender?.categories,
      isEventUpdated: calender?.isEventUpdated,
    })
  );
  // Inside your component
  const { events, categories, isEventUpdated } = useSelector(
    selectLayoutProperties
  );

  useEffect(() => {
    dispatch(onGetEvents());
    dispatch(onGetCategories());
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".external-event",
    });
  }, [dispatch]);

  useEffect(() => {
    setUpcommingevents(events);
    Object.entries(upcommingevents).sort((o1, o2) => {
      return new Date(o1.start) - new Date(o2.start);
    });
  }, [events, upcommingevents]);

  useEffect(() => {
    if (isEventUpdated) {
      setIsEdit(false);
      setEvent({});
      setTimeout(() => {
        dispatch(resetCalendar("isEventUpdated", false));
      }, 500);
    }
  }, [dispatch, isEventUpdated]);

  // AddModal aç/kapat
  const openAddModal = (date) => {
    // Eğer date bir dizi ise (handleDateClick'ten gelirse), start ve end olarak ayarla
    let startDate, endDate;
    if (Array.isArray(date)) {
      startDate = date[0];
      endDate = date[1];
    } else {
      startDate = date;
      endDate = date;
    }
    setEvent({ start: startDate, end: endDate });
    setSelectedNewDay([startDate, endDate]);
    setAddModal(true);
  };
  const closeAddModal = () => {
    setAddModal(false);
    setEvent({});
    setSelectedNewDay([]);
  };

  // PreviewModal aç/kapat
  const openPreviewModal = (eventData) => {
    setEvent(eventData);
    setPreviewModal(true);
  };
  const closePreviewModal = () => {
    setPreviewModal(false);
  };

  // EditModal aç/kapat
  const openEditModal = (eventData) => {
    setEvent(eventData);
    setEditModal(true);
    setSelectedNewDay([eventData.start, eventData.end]);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setEvent({});
    setSelectedNewDay([]);
  };
  /**
   * Handling date click on calendar
   */

  const handleDateClick = (arg) => {
    const date = arg["date"];
    // Seçilen günün saatini 00:00 olarak ayarla
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    // End date'i aynı günün 23:59'u olarak ayarla
    const endDate = new Date(date);
    endDate.setHours(23, 59, 0, 0);
    openAddModal([startDate, endDate]);
  };

  const str_dt = function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var d = new Date(date),
      month = "" + monthNames[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day + " " + month, year].join(",");
  };

  const date_r = function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    const eventObj = arg.event;
    const st_date = eventObj.start;
    const ed_date = eventObj.end;
    const r_date =
      ed_date == null
        ? str_dt(st_date)
        : str_dt(st_date) + " to " + str_dt(ed_date);
    const er_date =
      ed_date == null
        ? date_r(st_date)
        : date_r(st_date) + " to " + date_r(ed_date);

    openPreviewModal({
      id: eventObj.id,
      title: eventObj.title,
      start: eventObj.start,
      end: eventObj.end,
      className: eventObj.classNames,
      category: eventObj.classNames[0],
      location: eventObj._def.extendedProps.location,
      description: eventObj._def.extendedProps.description,
      defaultDate: er_date,
      datetag: r_date,
    });
  };
  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    // API ile silme
    (async () => {
      try {
        await deleteRandevu(event.id);
        if (authUser && authUser.id) {
          const response = await getPanelUserRandevular(authUser.id);
          setRandevular(response);
        }
      } catch (error) {
        console.error("Randevu silme hatası:", error);
      }
      setDeleteModal(false);
    })();
  };

  // events validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (event && event.title) || "",
      start: (event && event.start) || "",
      end: (event && event.end) || "",
      description: (event && event.description) || "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("İsim zorunlu"),
      start: Yup.date().required("Başlangıç tarihi zorunlu"),
      end: Yup.date().required("Bitiş tarihi zorunlu"),
      description: Yup.string().required("Açıklama zorunlu"),
    }),
    onSubmit: async (values) => {
      // Flatpickr ile seçilen tarih aralığı
      let startDate = values.start;
      let endDate = values.end;
      if (selectedNewDay && selectedNewDay.length === 2) {
        startDate = selectedNewDay[0];
        endDate = selectedNewDay[1];
      }
      // Flatpickr'den gelen tarih local'dir, UTC'ye çevrilmeli
      const toISOStringLocal = (date) => {
        if (!date) return new Date().toISOString();
        const d = new Date(date);
        const tzOffset = d.getTimezoneOffset() * 60000;
        return (
          new Date(d.getTime() - tzOffset).toISOString().slice(0, 19) + "Z"
        );
      };
      const payload = {
        name: values.name,
        start: startDate
          ? toISOStringLocal(startDate)
          : toISOStringLocal(new Date()),
        end: endDate ? toISOStringLocal(endDate) : toISOStringLocal(new Date()),
        description: values.description,
        createdOn: toISOStringLocal(new Date()),
      };
      try {
        if (isEdit) {
          await updateRandevu(event.id, payload);
        } else {
          await createRandevu(payload);
        }
        // Güncel randevuları tekrar çek
        if (authUser && authUser.id) {
          const response = await getPanelUserRandevular(authUser.id);
          setRandevular(response);
        }
        validation.resetForm();
      } catch (error) {
        console.error("Randevu ekleme/güncelleme hatası:", error);
      }
      setSelectedDay(null);
      setSelectedNewDay(null);
    },
  });

  const submitOtherEvent = () => {
    // Sadece formun edit modunu açmak için state'i güncelle
    setIsEditButton(true);
  };

  /**
   * On category darg event
   */
  const onDrag = (event) => {
    event.preventDefault();
  };

  /**
   * On calendar drop event
   */
  const onDrop = (event) => {
    const date = event["date"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currectDate = new Date();
    const currentHour = currectDate.getHours();
    const currentMin = currectDate.getMinutes();
    const currentSec = currectDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    const draggedEl = event.draggedEl;
    const draggedElclass = draggedEl.className;
    if (
      draggedEl.classList.contains("external-event") &&
      draggedElclass.indexOf("fc-event-draggable") === -1
    ) {
      const modifiedData = {
        id: Math.floor(Math.random() * 1000),
        title: draggedEl.innerText,
        start: modifiedDate,
        className: draggedEl.className,
      };
      dispatch(onAddNewEvent(modifiedData));
    }
  };
  document.title = "Calendar | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Calendar" pageTitle="Apps" />
          <Row>
            <Col xs={12}>
              <Row>
                {/** Welcome Message */}
                <Col xl={3}>
                  <Card className="card-h-100">
                    <CardBody>
                      <button
                        className="btn btn-primary w-100"
                        id="btn-new-event"
                        onClick={() => openAddModal()}
                      >
                        <i className="mdi mdi-plus"></i> Yeni Randevu Oluştur
                      </button>

                      <div id="external-events">
                        <br />
                        <p className="text-muted">
                          Etkinliğinizi sürükleyip bırakın veya takvime tıklayın
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="border p-3 mt-3">
                    <h5 className="mb-1">Yaklaşan Randevular</h5>
                    <p className="text-muted">Kaçırmayın</p>
                    <SimpleBar
                      className="pe-2 me-n1 mb-3"
                      style={{ height: "400px" }}
                    >
                      <div id="upcoming-event-list">
                        {calendarEvents &&
                          calendarEvents
                            .filter((event) => {
                              const startDate = new Date(event.start);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const threeDaysLater = new Date(today);
                              threeDaysLater.setDate(today.getDate() + 3);
                              // Bugün ve sonraki 3 gün
                              return (
                                startDate >= today && startDate < threeDaysLater
                              );
                            })
                            .sort(
                              (a, b) => new Date(a.start) - new Date(b.start)
                            )
                            .map((event, key) => (
                              <UpcommingEvents event={event} key={key} />
                            ))}
                      </div>
                    </SimpleBar>
                  </div>
                </Col>

                {/* Calendar */}
                <Col xl={9}>
                  <Card className="card-h-100">
                    <CardBody>
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          interactionPlugin,
                          listPlugin,
                        ]}
                        initialView="dayGridMonth"
                        slotDuration={"00:15:00"}
                        handleWindowResize={true}
                        themeSystem="bootstrap"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                        }}
                        events={calendarEvents}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        drop={onDrop}
                        eventDrop={async (info) => {
                          // Sadece günü değiştir, saat bilgisini koru
                          const oldStart = info.oldEvent.start;
                          const newStart = info.event.start;
                          const oldEnd = info.oldEvent.end;
                          const newEnd = info.event.end;
                          // Saat bilgisini koruyarak yeni gün oluştur
                          const updatedStart = new Date(newStart);
                          const oldStartDate = new Date(oldStart);
                          updatedStart.setHours(
                            oldStartDate.getHours(),
                            oldStartDate.getMinutes(),
                            oldStartDate.getSeconds(),
                            oldStartDate.getMilliseconds()
                          );
                          let updatedEnd = null;
                          if (oldEnd && newEnd) {
                            updatedEnd = new Date(newEnd);
                            const oldEndDate = new Date(oldEnd);
                            updatedEnd.setHours(
                              oldEndDate.getHours(),
                              oldEndDate.getMinutes(),
                              oldEndDate.getSeconds(),
                              oldEndDate.getMilliseconds()
                            );
                          }
                          // Flatpickr ve formda kullandığımız gibi local toISOString fonksiyonu
                          const toISOStringLocal = (date) => {
                            if (!date) return new Date().toISOString();
                            const d = new Date(date);
                            const tzOffset = d.getTimezoneOffset() * 60000;
                            return (
                              new Date(d.getTime() - tzOffset)
                                .toISOString()
                                .slice(0, 19) + "Z"
                            );
                          };
                          try {
                            await updateRandevu(info.event.id, {
                              name: info.event.title,
                              start: toISOStringLocal(updatedStart),
                              end: updatedEnd
                                ? toISOStringLocal(updatedEnd)
                                : null,
                              description:
                                info.event.extendedProps.description || "",
                              updatedOn: toISOStringLocal(new Date()),
                            });
                            if (authUser && authUser.id) {
                              const response = await getPanelUserRandevular(
                                authUser.id
                              );
                              setRandevular(response);
                            }
                          } catch (error) {
                            console.error(
                              "Event güncelleme (sürükle) hatası:",
                              error
                            );
                          }
                        }}
                        locales={[trLocale]}
                        locale="tr"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <div style={{ clear: "both" }}></div>
              {/* AddModal */}
              <Modal isOpen={addModal} toggle={closeAddModal} centered>
                <ModalHeader
                  toggle={closeAddModal}
                  tag="h5"
                  className="p-3 bg-info-subtle modal-title"
                >
                  Yeni Randevu Oluştur
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      // Formik ile yeni randevu ekleme
                      const values = {
                        name: event.name || "",
                        start: event.start || "",
                        end: event.end || "",
                        description: event.description || "",
                      };
                      // Basit validation
                      if (!values.name || !values.start || !values.end) return;
                      const toISOStringLocal = (date) => {
                        if (!date) return new Date().toISOString();
                        const d = new Date(date);
                        const tzOffset = d.getTimezoneOffset() * 60000;
                        return (
                          new Date(d.getTime() - tzOffset)
                            .toISOString()
                            .slice(0, 19) + "Z"
                        );
                      };
                      const payload = {
                        name: values.name,
                        start: toISOStringLocal(values.start),
                        end: toISOStringLocal(values.end),
                        description: values.description,
                        createdOn: toISOStringLocal(new Date()),
                      };
                      try {
                        await createRandevu(payload);
                        if (authUser && authUser.id) {
                          const response = await getPanelUserRandevular(
                            authUser.id
                          );
                          setRandevular(response);
                        }
                        closeAddModal();
                      } catch (error) {
                        console.error("Randevu ekleme hatası:", error);
                      }
                    }}
                  >
                    <div className="mb-3">
                      <Label className="form-label">Randevu İsmi</Label>
                      <Input
                        type="text"
                        placeholder="Randevu ismi giriniz"
                        value={event.name || ""}
                        onChange={(e) =>
                          setEvent({ ...event, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <Label>Başlangıç Tarihi</Label>
                      <Flatpickr
                        className="form-control"
                        value={event.start || ""}
                        options={{
                          dateFormat: "Y-m-d H:i",
                          enableTime: true,
                          time_24hr: true,
                        }}
                        onChange={(date) => {
                          setEvent({ ...event, start: date[0] });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label>Bitiş Tarihi</Label>
                      <Flatpickr
                        className="form-control"
                        value={event.end || ""}
                        options={{
                          dateFormat: "Y-m-d H:i",
                          enableTime: true,
                          time_24hr: true,
                        }}
                        onChange={(date) => {
                          setEvent({ ...event, end: date[0] });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Açıklama</Label>
                      <Input
                        type="textarea"
                        placeholder="Açıklama giriniz"
                        value={event.description || ""}
                        onChange={(e) =>
                          setEvent({ ...event, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-success">
                        Kaydet
                      </button>
                    </div>
                  </Form>
                </ModalBody>
              </Modal>

              {/* PreviewModal */}
              <Modal isOpen={previewModal} toggle={closePreviewModal} centered>
                <ModalHeader
                  toggle={closePreviewModal}
                  tag="h5"
                  className="p-3 bg-info-subtle modal-title"
                >
                  Randevu Detayı
                </ModalHeader>
                <ModalBody>
                  {/* Randevu Detayları */}
                  <div className="mb-3">
                    <Label className="form-label fw-bold">Randevu İsmi:</Label>
                    <div>{event.title || event.name || "-"}</div>
                  </div>
                  <div className="mb-3">
                    <Label className="form-label fw-bold">Tarih:</Label>
                    <div>
                      {event.start && event.end ? (
                        <>
                          <span>
                            {new Date(event.start).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <br />
                          <span>
                            {new Date(event.end).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <Label className="form-label fw-bold">Açıklama:</Label>
                    <div>{event.description || "-"}</div>
                  </div>
                  <div className="text-end">
                    <button
                      className="btn btn-sm btn-soft-primary me-2"
                      onClick={() => {
                        closePreviewModal();
                        openEditModal(event);
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      className="btn btn-sm btn-soft-danger"
                      onClick={() => {
                        closePreviewModal();
                        setDeleteModal(true);
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </ModalBody>
              </Modal>

              {/* EditModal */}
              <Modal isOpen={editModal} toggle={closeEditModal} centered>
                <ModalHeader
                  toggle={closeEditModal}
                  tag="h5"
                  className="p-3 bg-info-subtle modal-title"
                >
                  Randevuyu Düzenle
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      // Formik ile düzenleme
                      const values = {
                        name: event.title || event.name || "",
                        start: event.start || "",
                        end: event.end || "",
                        description: event.description || "",
                      };
                      // Basit validation
                      if (!values.name || !values.start || !values.end) return;
                      const toISOStringLocal = (date) => {
                        if (!date) return new Date().toISOString();
                        const d = new Date(date);
                        const tzOffset = d.getTimezoneOffset() * 60000;
                        return (
                          new Date(d.getTime() - tzOffset)
                            .toISOString()
                            .slice(0, 19) + "Z"
                        );
                      };
                      const payload = {
                        name: values.name,
                        start: toISOStringLocal(values.start),
                        end: toISOStringLocal(values.end),
                        description: values.description,
                        updatedOn: toISOStringLocal(new Date()),
                      };
                      try {
                        await updateRandevu(event.id, payload);
                        if (authUser && authUser.id) {
                          const response = await getPanelUserRandevular(
                            authUser.id
                          );
                          setRandevular(response);
                        }
                        closeEditModal();
                      } catch (error) {
                        console.error("Randevu güncelleme hatası:", error);
                      }
                    }}
                  >
                    <div className="mb-3">
                      <Label className="form-label">Randevu İsmi</Label>
                      <Input
                        type="text"
                        placeholder="Randevu ismi giriniz"
                        value={event.title || event.name || ""}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            title: e.target.value,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <Label>Başlangıç Tarihi</Label>
                      <Flatpickr
                        className="form-control"
                        value={event.start || ""}
                        options={{
                          dateFormat: "Y-m-d H:i",
                          enableTime: true,
                          time_24hr: true,
                        }}
                        onChange={(date) => {
                          setEvent({ ...event, start: date[0] });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label>Bitiş Tarihi</Label>
                      <Flatpickr
                        className="form-control"
                        value={event.end || ""}
                        options={{
                          dateFormat: "Y-m-d H:i",
                          enableTime: true,
                          time_24hr: true,
                        }}
                        onChange={(date) => {
                          setEvent({ ...event, end: date[0] });
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Açıklama</Label>
                      <Input
                        type="textarea"
                        placeholder="Açıklama giriniz"
                        value={event.description || ""}
                        onChange={(e) =>
                          setEvent({ ...event, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-success">
                        Kaydet
                      </button>
                    </div>
                  </Form>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Calender.propTypes = {
  events: PropTypes.any,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
};

export default Calender;
