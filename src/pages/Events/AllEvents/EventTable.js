import React, { useEffect, useState } from "react";
import { getEventList, deleteEventList } from "../../../slices/thunks";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

function EventTable() {
  const dispatch = useDispatch();

  const selectEventData = createSelector(
    (state) => state.Events,
    (Events) => Events.eventLists
  );
  const eventLists = useSelector(selectEventData);

  const [event, setEvent] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getEventList());
  }, [dispatch]);

  const onClickData = (event) => {
    setEvent(event);
    setDeleteModal(true);
  };
  // Silme işlemi

  const handleDeleteEventList = () => {
    if (event) {
      dispatch(deleteEventList(event.id));
      setDeleteModal(false);
    }
  };

  // Tablo kolonları
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

  // TableContainer'ın satırlarını logla
  // import { useReactTable } from "@tanstack/react-table"; // yukarıda zaten TableContainer'da var
  // TableContainer'ın içini loglamak için TableContainer'a bir prop ekleyebilirsin

  return (
    <div>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteEventList()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <TableContainer
        columns={columns}
        data={eventLists || []}
        customPageSize={10}
        className="custom-header-css"
        divClass="table-responsive table-card mb-3"
        tableClass="align-middle table-nowrap mb-0"
        theadClass="table-light table-nowrap"
        thClass="table-light text-muted"
        isGlobalFilter={false}
      />
    </div>
  );
}

export default EventTable;
