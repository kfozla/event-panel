import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import BootstrapTheme from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import trLocale from "@fullcalendar/core/locales/tr";
import { useParams } from "react-router-dom";
import { getRandevularByPanelUserId } from "../../api/randevu";

import { Modal, ModalHeader, ModalBody, Label } from "reactstrap";

const UserRandevuCalendar = () => {
  const { id } = useParams();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchRandevular = async () => {
      try {
        const response = await getRandevularByPanelUserId(id);
        if (Array.isArray(response)) {
          const mapped = response.map((r) => ({
            id: r.id,
            title: r.name,
            start: r.start,
            end: r.end,
            description: r.description,
          }));
          setCalendarEvents(mapped);
        }
      } catch (error) {
        console.error("Error fetching randevular:", error);
      }
    };
    fetchRandevular();
  }, [id]);

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event);
    setModalOpen(true);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card>
              <CardBody>
                <h4 className="mb-4">Kullanıcı Randevu Takvimi</h4>
                <FullCalendar
                  plugins={[BootstrapTheme, dayGridPlugin, listPlugin]}
                  initialView="dayGridMonth"
                  themeSystem="bootstrap"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                  }}
                  events={calendarEvents}
                  locales={[trLocale]}
                  locale="tr"
                  height={650}
                  editable={false}
                  selectable={false}
                  droppable={false}
                  eventClick={handleEventClick}
                />
                <Modal
                  isOpen={modalOpen}
                  toggle={() => setModalOpen(false)}
                  centered
                >
                  <ModalHeader
                    toggle={() => setModalOpen(false)}
                    tag="h5"
                    className="p-3 bg-info-subtle modal-title"
                  >
                    Randevu Detayı
                  </ModalHeader>
                  <ModalBody>
                    {selectedEvent && (
                      <>
                        <div className="mb-3">
                          <Label className="form-label fw-bold">
                            Randevu İsmi:
                          </Label>
                          <div>{selectedEvent.title || "-"}</div>
                        </div>
                        <div className="mb-3">
                          <Label className="form-label fw-bold">Tarih:</Label>
                          <div>
                            {selectedEvent.start && selectedEvent.end ? (
                              <>
                                <span>
                                  {new Date(
                                    selectedEvent.start
                                  ).toLocaleDateString("tr-TR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <br />
                                <span>
                                  {new Date(
                                    selectedEvent.end
                                  ).toLocaleDateString("tr-TR", {
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
                          <Label className="form-label fw-bold">
                            Açıklama:
                          </Label>
                          <div>
                            {selectedEvent.extendedProps?.description ||
                              selectedEvent.description ||
                              "-"}
                          </div>
                        </div>
                      </>
                    )}
                  </ModalBody>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserRandevuCalendar;
