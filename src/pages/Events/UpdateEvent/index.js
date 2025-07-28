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
  Select as SelectComponent,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import { Turkish } from "flatpickr/dist/l10n/tr.js";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../../api/events";
import { ToastContainer, toast } from "react-toastify";
import { set } from "lodash";

const UpdateEvent = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState({});
  const [editorData, setEditorData] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [domainName, setDomainName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("light"); // Varsayılan tema "light"
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEventById(id);
        setEventData(data);
        setEditorData(data.description || "");
        setStartDate(data.startTime ? new Date(data.startTime) : null);
        setEndDate(data.endTime ? new Date(data.endTime) : null);
        setThumbnailUrl(data.thumbnailUrl || "");
        setSelectedTheme(data.theme || "light"); // Varsayılan tema "light"
        setDomainName(data.domainName || "");
      } catch (err) {
        console.error("Etkinlik verisi alınamadı:", err);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  const formatLocalDateTime = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };
  // Form submit fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData.name || !editorData || !startDate || !endDate) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    // eventData'yı güncelle
    const payload = {
      ...eventData,
      description: editorData,
      // toISOString() yerine formatLocalDateTime kullanın
      startTime: formatLocalDateTime(startDate),
      endTime: formatLocalDateTime(endDate),
      thumbnailUrl: thumbnailUrl,
      domainName: domainName || "",
      theme: selectedTheme || "light", // Varsayılan tema "light"
    };
    try {
      await updateEvent(id, payload);
      navigate("/apps-events-all"); // Yönlendirmek istediğiniz sayfanın path'i
      // Başarılı güncelleme sonrası istersen yönlendirme veya mesaj ekleyebilirsin
    } catch (err) {
      // Hata yönetimi
      console.error(err);
    }
  };

  const [selectedMulti, setselectedMulti] = useState(null);

  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }

  //Dropzone file upload
  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  document.title = "Create Project | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Etkinlik Düzenle" pageTitle="Etkinlikler" />
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
                        value={eventData.name}
                        onChange={(e) =>
                          setEventData({ ...eventData, name: e.target.value })
                        }
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
                            onChange={(dates) => setStartDate(dates[0])}
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
                            onChange={(dates) => setEndDate(dates[0])}
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
                    Düzenle
                  </button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UpdateEvent;
