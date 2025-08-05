import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import { Turkish } from "flatpickr/dist/l10n/tr.js";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

import { createEvent } from "../../../api/events";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { use } from "react";

const AddEvent = () => {
  const SingleOptions = [
    { value: "Watches", label: "Watches" },
    { value: "Headset", label: "Headset" },
    { value: "Sweatshirt", label: "Sweatshirt" },
    { value: "20% off", label: "20% off" },
    { value: "4 star", label: "4 star" },
  ];

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // CKEditor için ayrı state
  const [editorData, setEditorData] = useState("");

  // Başlama ve bitiş tarihi için ayrı state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Kapak resmi için url
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  const [domainName, setDomainName] = useState("");

  useEffect(() => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser") || "null");
  }, []);

  // Form submit fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !editorData || !startDate || !endDate || !domainName) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    // eventData'yı güncelle
    const payload = {
      name: name,
      description: editorData,
      startTime: startDate ? startDate[0] : "",
      endTime: endDate ? endDate[0] : "",
      thumbnailUrl: thumbnailUrl,
      theme: selectedTheme,
      domainName: domainName,
    };
    console.log("Payload:", payload);
    try {
      await createEvent(payload);
      navigate("/apps-events-all");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data || "Etkinlik oluşturulurken bir hata oluştu."
      );
    }
  };
  document.title = "Create Project | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Etkinlik Ekle" pageTitle="Etkinlikler" />
          <Row>
            <Col lg={10}>
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="project-title-input"
                      >
                        Etkinlik Başlığı
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="project-title-input"
                        placeholder="Etkinlik Başlığı Girin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="project-thumbnail-img"
                      >
                        Kapak Resmi (URL)
                      </Label>
                      <Input
                        className="form-control"
                        id="project-thumbnail-img"
                        type="text"
                        placeholder="Kapak Resmi URL'si"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Etkinlik Açıklaması</Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={editorData}
                        onChange={(event, editor) => {
                          setEditorData(editor.getData());
                        }}
                      />
                    </div>

                    <Row>
                      <Col lg={4} style={{ maxWidth: "240px" }}>
                        <div>
                          <Label
                            htmlFor="datepicker-deadline-input"
                            className="form-label"
                          >
                            Etkinlik Başlama Tarihi ve Saati
                          </Label>
                          <Flatpickr
                            className="form-control "
                            options={{
                              enableTime: true,
                              time_24hr: true,
                              dateFormat: "Y-m-d H:i",
                              locale: Turkish,
                            }}
                            placeholder="Etkinlik Tarihi Seçin"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                          />
                        </div>
                      </Col>
                      <Col lg={4} style={{ maxWidth: "240px" }}>
                        <div>
                          <Label
                            htmlFor="datepicker-deadline-input"
                            className="form-label"
                          >
                            Etkinlik Bitiş Tarihi ve Saati
                          </Label>
                          <Flatpickr
                            className="form-control "
                            options={{
                              enableTime: true,
                              time_24hr: true,
                              dateFormat: "Y-m-d H:i",
                              locale: Turkish,
                            }}
                            placeholder="Etkinlik Tarihi Seçin"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                          />
                        </div>
                      </Col>
                      <Col lg={4} style={{ maxWidth: "240px" }}>
                        <div>
                          <Label
                            htmlFor="datepicker-deadline-input"
                            className="form-label"
                          >
                            Tema Seçimi
                          </Label>
                          <Select
                            options={[
                              {
                                value: "light",
                                label: "🌞 Aydınlık (Açık renkler)",
                              },
                              {
                                value: "dark",
                                label: "🌙 Karanlık (Koyu renkler)",
                              },
                            ]}
                            placeholder="Tema Seçin"
                            value={
                              selectedTheme
                                ? {
                                    value: selectedTheme,
                                    label:
                                      selectedTheme === "light"
                                        ? "🌞 Aydınlık (Açık renkler)"
                                        : "🌙 Karanlık (Koyu renkler)",
                                  }
                                : null
                            }
                            onChange={(option) =>
                              setSelectedTheme(option.value)
                            }
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                      </Col>
                      <Col lg={4} style={{ maxWidth: "240px" }}>
                        <Label htmlFor="domain-name" className="form-label">
                          Domain Adı
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="domain-name"
                          placeholder="Domain Adı Girin"
                          value={domainName || ""}
                          onChange={(e) => setDomainName(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <div className="text-end mb-4 ">
                  <button
                    type="button"
                    className="btn btn-soft-secondary w-sm me-1"
                    onClick={() => navigate("/apps-events-all")}
                  >
                    Geri Dön
                  </button>

                  <button type="submit" className="btn btn-success w-sm">
                    Ekle
                  </button>
                </div>
              </form>
              {/* Add more sections as needed 
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Dosya Ekle</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <p className="text-muted">Dosyaları buraya ekleyin.</p>

                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h4>
                              Dosyaları buraya ekleyin veya yüklemek için
                              tıklayın.
                            </h4>
                          </div>
                        </div>
                      )}
                    </Dropzone>

                    <ul className="list-unstyled mb-0" id="dropzone-preview">
                      {selectedFiles.map((f, i) => {
                        return (
                          <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + "-file"}
                          >
                            <div className="p-2">
                              <Row className="align-items-center">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    height="80"
                                    className="avatar-sm rounded bg-light"
                                    alt={f.name}
                                    src={f.preview}
                                  />
                                </Col>
                                <Col>
                                  <Link
                                    to="#"
                                    className="text-muted font-weight-bold"
                                  >
                                    {f.name}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{f.formattedSize}</strong>
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        );
                      })}
                    </ul>
                  </div>
                </CardBody>
              </Card>
*/}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddEvent;
