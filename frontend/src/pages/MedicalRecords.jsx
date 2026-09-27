import { useEffect, useState } from "react";

function MedicalRecords({
  onAddMedicalRecord,
  onEditMedicalRecord,
}) {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ALL DATA
  // =========================
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [
        recordsResponse,
        patientsResponse,
        doctorsResponse,
      ] = await Promise.all([
        fetch("http://localhost:8080/api/medical-records"),
        fetch("http://localhost:8080/api/patients"),
        fetch("http://localhost:8080/api/doctors"),
      ]);

      if (!recordsResponse.ok) {
        throw new Error(
          `Medical records API error: ${recordsResponse.status}`
        );
      }

      if (!patientsResponse.ok) {
        throw new Error(
          `Patients API error: ${patientsResponse.status}`
        );
      }

      if (!doctorsResponse.ok) {
        throw new Error(
          `Doctors API error: ${doctorsResponse.status}`
        );
      }

      const recordsData = await recordsResponse.json();
      const patientsData = await patientsResponse.json();
      const doctorsData = await doctorsResponse.json();

      console.log("Medical Records API:", recordsData);
      console.log("Patients API:", patientsData);
      console.log("Doctors API:", doctorsData);

      setRecords(
        Array.isArray(recordsData)
          ? recordsData
          : []
      );

      setPatients(
        Array.isArray(patientsData)
          ? patientsData
          : []
      );

      setDoctors(
        Array.isArray(doctorsData)
          ? doctorsData
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching medical records data:",
        error
      );

      setRecords([]);
      setPatients([]);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchAllData();
  }, []);

  // =========================
  // GET PATIENT NAME
  // =========================
  const getPatientName = (patientId) => {
    if (
      patientId === null ||
      patientId === undefined ||
      patientId === ""
    ) {
      return "Patient";
    }

    const patient = patients.find(
      (item) =>
        Number(item.id) === Number(patientId)
    );

    if (!patient) {
      return `Patient #${patientId}`;
    }

    return (
      patient.name ||
      patient.fullName ||
      `${patient.firstName || ""} ${
        patient.lastName || ""
      }`.trim() ||
      `Patient #${patientId}`
    );
  };

  // =========================
  // GET DOCTOR NAME
  // =========================
  const getDoctorName = (doctorId) => {
    if (
      doctorId === null ||
      doctorId === undefined ||
      doctorId === ""
    ) {
      return "Doctor";
    }

    const doctor = doctors.find(
      (item) =>
        Number(item.id) === Number(doctorId)
    );

    if (!doctor) {
      return `Doctor #${doctorId}`;
    }

    return (
      doctor.name ||
      doctor.fullName ||
      `${doctor.firstName || ""} ${
        doctor.lastName || ""
      }`.trim() ||
      `Doctor #${doctorId}`
    );
  };

  // =========================
  // DELETE MEDICAL RECORD
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/medical-records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRecords((currentRecords) =>
          currentRecords.filter(
            (record) =>
              Number(record.id) !== Number(id)
          )
        );

        alert(
          "Medical record deleted successfully!"
        );
      } else {
        alert(
          "Failed to delete medical record"
        );
      }
    } catch (error) {
      console.error(
        "Error deleting medical record:",
        error
      );

      alert("Backend connection error");
    }
  };

  // =========================
  // SEARCH / FILTER
  // =========================
  const filteredRecords = records.filter(
    (record) => {
      const search =
        searchTerm.trim().toLowerCase();

      if (!search) {
        return true;
      }

      const patientName = getPatientName(
        record.patientId
      ).toLowerCase();

      const doctorName = getDoctorName(
        record.doctorId
      ).toLowerCase();

      return (
        String(record.id || "")
          .toLowerCase()
          .includes(search) ||

        String(record.patientId || "")
          .toLowerCase()
          .includes(search) ||

        String(record.doctorId || "")
          .toLowerCase()
          .includes(search) ||

        patientName.includes(search) ||

        doctorName.includes(search) ||

        String(record.diagnosis || "")
          .toLowerCase()
          .includes(search) ||

        String(record.treatment || "")
          .toLowerCase()
          .includes(search) ||

        String(record.prescription || "")
          .toLowerCase()
          .includes(search) ||

        String(record.recordDate || "")
          .toLowerCase()
          .includes(search)
      );
    }
  );

  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Medical Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient diagnosis, treatment and prescription records
          </p>
        </div>

        <button
          onClick={onAddMedicalRecord}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md"
        >
          <span className="text-xl leading-none">
            +
          </span>

          Add Medical Record
        </button>

      </div>

      {/* =========================
          SEARCH + SUMMARY
      ========================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">

            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />

              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>

            <input
              type="text"
              placeholder="Search medical records..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white"
            />

          </div>

          {/* TOTAL RECORDS */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              {records.length}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Total Records
              </p>

              <p className="text-xs text-slate-400">
                Medical records in system
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          MEDICAL RECORD TABLE
      ========================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200">

          <h3 className="font-bold text-slate-800">
            Medical Record List
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {filteredRecords.length} record
            {filteredRecords.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="py-16 text-center">

            <div className="inline-block w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

            <p className="mt-4 text-sm text-slate-500">
              Loading medical records...
            </p>

          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1350px] table-fixed">

              {/* FIXED COLUMN WIDTHS */}
              <colgroup>
                <col className="w-[90px]" />
                <col className="w-[210px]" />
                <col className="w-[210px]" />
                <col className="w-[200px]" />
                <col className="w-[230px]" />
                <col className="w-[230px]" />
                <col className="w-[150px]" />
                <col className="w-[220px]" />
              </colgroup>

              {/* TABLE HEADER */}
              <thead>

                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Diagnosis
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Treatment
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Prescription
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Record Date
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100">

                {filteredRecords.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >

                      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">

                        <svg
                          width="27"
                          height="27"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 3h16v18H4z" />
                          <path d="M8 7h8" />
                          <path d="M8 11h8" />
                          <path d="M8 15h5" />
                        </svg>

                      </div>

                      <p className="mt-4 font-semibold text-slate-700">
                        No medical records found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or add a new medical record.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredRecords.map((record) => (

                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* ID */}
                      <td className="px-6 py-5 align-middle">

                        <span className="inline-flex items-center justify-center min-w-10 h-8 px-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                          #{record.id}
                        </span>

                      </td>

                      {/* PATIENT */}
                      <td className="px-6 py-5 align-middle">

                        <div className="min-w-0">

                          <p
                            className="text-sm font-semibold text-slate-700 truncate"
                            title={getPatientName(
                              record.patientId
                            )}
                          >
                            {getPatientName(
                              record.patientId
                            )}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {record.patientId}
                          </p>

                        </div>

                      </td>

                      {/* DOCTOR */}
                      <td className="px-6 py-5 align-middle">

                        <div className="min-w-0">

                          <p
                            className="text-sm font-semibold text-slate-700 truncate"
                            title={getDoctorName(
                              record.doctorId
                            )}
                          >
                            {getDoctorName(
                              record.doctorId
                            )}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {record.doctorId}
                          </p>

                        </div>

                      </td>

                      {/* DIAGNOSIS */}
                      <td className="px-6 py-5 align-middle">

                        <p
                          className="text-sm font-medium text-slate-700 truncate"
                          title={record.diagnosis || ""}
                        >
                          {record.diagnosis || "-"}
                        </p>

                      </td>

                      {/* TREATMENT */}
                      <td className="px-6 py-5 align-middle">

                        <p
                          className="text-sm text-slate-600 truncate"
                          title={record.treatment || ""}
                        >
                          {record.treatment || "-"}
                        </p>

                      </td>

                      {/* PRESCRIPTION */}
                      <td className="px-6 py-5 align-middle">

                        <p
                          className="text-sm text-slate-600 truncate"
                          title={record.prescription || ""}
                        >
                          {record.prescription || "-"}
                        </p>

                      </td>

                      {/* RECORD DATE */}
                      <td className="px-6 py-5 align-middle">

                        <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
                          {record.recordDate || "-"}
                        </p>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5 align-middle">

                        <div className="flex items-center justify-center gap-2">

                          {/* EDIT */}
                          <button
                            onClick={() =>
                              onEditMedicalRecord(
                                record.id
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 min-w-[78px] px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-semibold"
                          >

                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />

                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>

                            Edit

                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              handleDelete(
                                record.id
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 min-w-[88px] px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold"
                          >

                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />

                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />

                              <path d="M10 11v6" />

                              <path d="M14 11v6" />

                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>

                            Delete

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default MedicalRecords;