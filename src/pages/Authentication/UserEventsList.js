import React, { useEffect, useState } from "react";
import {
  getPanelUserAll,
  deletePanelUser,
  getPanelUserById,
  getPanelUserEventsById,
} from "../../api/panelUser";

import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useParams } from "react-router-dom";
import { set } from "lodash";

function UserEventsList() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const URL = "http://localhost:5176/";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getPanelUserById(id);
        console.log("Fetched user:", response);
        const eventsResponse = await getPanelUserEventsById(id);
        console.log("Fetched user events:", eventsResponse);

        setUser(response);
        setEvents(eventsResponse);
      } catch (error) {
        console.error("Error fetching panel user :", error);
      }
    };
    fetchUser();
  }, []);

  const onClickData = (event) => {
    setEvent(event);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (event) {
      try {
        await deletePanelUser(event.id);
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
        toast.success("Etkinlik başarıyla silindi.");
      } catch (e) {
        toast.error("Etkinlik silinirken bir hata oluştu.");
      }
      setDeleteModal(false);
    }
  };

  const columns = [
    {
      id: "thumbnail",
      header: "",
      accessorKey: "thumbnailUrl",
      cell: (cell) => {
        const url = cell.getValue();
        return url ? (
          <div style={{ width: 40, height: 40 }}>
            <img
              src={url}
              alt="thumbnail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          </div>
        ) : (
          <div
            className="avatar-title rounded"
            style={{ width: 40, height: 40, backgroundColor: "#e0e0e0" }}
          ></div>
        );
      },
      enableColumnFilter: false,
    },
    {
      id: "name",
      header: "Başlık",
      accessorKey: "name",
      cell: (cell) => {
        const event = cell.row.original;
        return (
          <Link
            to={`/apps-events-overview/${event.id}`}
            style={{
              fontSize: "1rem",
              textDecoration: "none",
              color: "#010101ff",
              padding: "4px 4px",
            }}
          >
            {event.name}
          </Link>
        );
      },
      enableColumnFilter: false,
    },
    {
      id: "startTime",
      header: "Başlangıç",
      accessorKey: "startTime",
      cell: (cell) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleString("tr-TR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      enableColumnFilter: false,
    },
    {
      id: "endTime",
      header: "Bitiş",
      accessorKey: "endTime",
      cell: (cell) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleString("tr-TR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      enableColumnFilter: false,
    },
    {
      id: "modifiedOn",
      header: "Son Güncelleme",
      accessorKey: "modifiedOn",
      cell: (cell) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleString("tr-TR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      enableColumnFilter: false,
    },
    {
      id: "createdOn",
      header: "Eklenme Tarihi",
      accessorKey: "createdOn",
      cell: (cell) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleString("tr-TR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      enableColumnFilter: false,
    },

    {
      id: "actions",
      header: "İşlemler",
      accessorKey: "id",
      cell: (cell) => {
        const event = cell.row.original;
        return (
          <div className="d-flex flex-row gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => onClickData(event)}
              title="Sil"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
            <Link
              to={`/apps-events-update/${event.id}`}
              className="btn btn-sm btn-primary"
              style={{ color: "#fff" }}
              title="Düzenle"
            >
              <i className="ri-edit-2-line"></i>
            </Link>
            <Link
              to={`/apps-events-overview/${event.id}`}
              className="btn btn-sm btn-info"
              style={{ color: "#fff" }}
              title="Görüntüle"
            >
              <i className="ri-eye-line"></i>
            </Link>
          </div>
        );
      },
      enableColumnFilter: false,
    },
  ];
  console.log("user:", user);
  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title={
            user && user.username
              ? user.username + " kişisinin etkinlikleri"
              : "Etkinlikler"
          }
          pageTitle="Kullanıcı listesi"
        />
        <Container fluid>
          <ToastContainer closeButton={false} />
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteUser}
            onCloseClick={() => setDeleteModal(false)}
            headerText={"Etkinliği Sil"}
            content={`"${
              event ? event.title : ""
            }" etkinliğini silmek istediğinize emin misiniz ?`}
          />
          <TableContainer
            columns={columns}
            data={events || []}
            customPageSize={10}
            className="custom-header-css"
            divClass="table-responsive table-card mb-3"
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light table-nowrap"
            thClass="table-light text-muted"
            isGlobalFilter={false}
          />
        </Container>
      </div>
    </React.Fragment>
  );
}

export default UserEventsList;
