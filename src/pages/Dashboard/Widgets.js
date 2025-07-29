import React from "react";
import { projectsWidgets } from "../../common/data";
import { getEvents } from "../../api/events";
import CountUp from "react-countup";

//Import Icons
import FeatherIcon from "feather-icons-react";
import { Card, CardBody, Col, Row } from "reactstrap";

const Widgets = ({ eventCount, upcomingEventCount, pastEventCount }) => {
  const WidgetData = [
    {
      id: 1,
      feaIcon: "briefcase",
      feaIconClass: "primary",
      label: "Tüm Etkinlikler",
      caption: "Toplam etkinlik sayısı",
      subCounter: [{ id: 1, counter: eventCount, suffix: "" }],
    },
    {
      id: 2,
      feaIcon: "award",
      feaIconClass: "success",
      label: "Gelecek Etkinlikler",

      caption: "Gelecek etkinlik sayısı",
      subCounter: [
        { id: 1, counter: upcomingEventCount, suffix: "", separator: "," },
      ],
    },
    {
      id: 3,
      feaIcon: "clock",
      feaIconClass: "danger",
      label: "Geçmiş Etkinlikler",
      caption: "Geçmiş etkinlik sayısı",
      subCounter: [{ id: 1, counter: pastEventCount, suffix: "" }],
    },
  ];
  console.log(upcomingEventCount, pastEventCount, eventCount);
  return (
    <React.Fragment>
      <Row>
        {(WidgetData || []).map((item, key) => (
          <Col xl={4} key={key}>
            <Card className="card-animate">
              <CardBody>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span
                      className={`avatar-title bg-${item.feaIconClass}-subtle text-${item.feaIconClass} rounded-2 fs-2`}
                    >
                      <FeatherIcon
                        icon={item.feaIcon}
                        className={`text-${item.feaIconClass}`}
                      />
                    </span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden ms-3">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                      {item.label}
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <h4 className="fs-4 flex-grow-1 mb-0">
                        {item.subCounter.map((item, key) => (
                          <span
                            className="counter-value me-1"
                            data-target="825"
                            key={key}
                          >
                            <CountUp
                              start={0}
                              suffix={item.suffix}
                              separator={item.separator}
                              end={item.counter}
                              duration={4}
                            />
                          </span>
                        ))}
                      </h4>
                      <span
                        className={
                          "fs-12 badge bg-" +
                          item.badgeClass +
                          "-subtle text-" +
                          item.badgeClass
                        }
                      >
                        <i
                          className={"fs-13 align-middle me-1 " + item.icon}
                        ></i>
                        {item.percentage}
                      </span>
                    </div>
                    <p className="text-muted text-truncate mb-0">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default Widgets;
