import { useEffect, useState } from "react";

function Patients({ onAddPatient, onEditPatient }) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/patients"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/patients/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPatients((currentPatients) =>
          currentPatients.filter(
            (patient) =>
              Number(patient.id) !== Number(id)
          )
        );

        alert("Patient deleted successfully!");
      } else {
        alert("Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Backend connection error");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      String(patient.id || "")
        .toLowerCase()
        .includes(search) ||
      String(patient.name || "")
        .toLowerCase()
        .includes(search) ||
      String(patient.email || "")
        .toLowerCase()
        .includes(search) ||
      String(patient.phone || "")
        .toLowerCase()
        .includes(search) ||
      String(patient.gender || "")
        .toLowerCase()
        .includes(search) ||
      String(patient.medicalHistory || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Patient Management
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient registration and patient information
          </p>
        </div>

        <button
          onClick={onAddPatient}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
        >
          <span className="text-xl leading-none">
            +
          </span>

          Add Patient
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
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>

          {/* TOTAL PATIENTS */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              {patients.length}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Total Patients
              </p>

              <p className="text-xs text-slate-400">
                Registered in system
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          PATIENT TABLE
      ========================= */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* TABLE TITLE */}
        <div className="px-6 py-5 border-b border-slate-200">

          <h3 className="font-bold text-slate-800">
            Patient List
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {filteredPatients.length} patient
            {filteredPatients.length !== 1
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
              Loading patients...
            </p>

          </div>

        ) : (

          /* TABLE SCROLL */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1250px] table-fixed">

              {/* =========================
                  COLUMN WIDTHS
              ========================= */}
              <colgroup>
                <col className="w-[90px]" />
                <col className="w-[210px]" />
                <col className="w-[240px]" />
                <col className="w-[170px]" />
                <col className="w-[90px]" />
                <col className="w-[120px]" />
                <col className="w-[280px]" />
                <col className="w-[220px]" />
              </colgroup>

              {/* =========================
                  TABLE HEADER
              ========================= */}
              <thead>

                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Age
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Gender
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Medical History
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* =========================
                  TABLE BODY
              ========================= */}
              <tbody className="divide-y divide-slate-100">

                {filteredPatients.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >

                      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">

                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle
                            cx="9"
                            cy="7"
                            r="4"
                          />
                        </svg>

                      </div>

                      <p className="mt-4 font-semibold text-slate-700">
                        No patients found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or add a new patient.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredPatients.map((patient) => (

                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* =========================
                          ID
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <span className="inline-flex items-center justify-center min-w-10 h-8 px-2.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                          #{patient.id}
                        </span>

                      </td>

                      {/* =========================
                          PATIENT
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <div className="min-w-0">

                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {patient.name || "-"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ID: {patient.id}
                          </p>

                        </div>

                      </td>

                      {/* =========================
                          EMAIL
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <p
                          className="text-sm text-slate-600 truncate"
                          title={patient.email || ""}
                        >
                          {patient.email || "-"}
                        </p>

                      </td>

                      {/* =========================
                          PHONE
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <p className="text-sm text-slate-600 whitespace-nowrap">
                          {patient.phone || "-"}
                        </p>

                      </td>

                      {/* =========================
                          AGE
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <span className="text-sm font-medium text-slate-700">
                          {patient.age ?? "-"}
                        </span>

                      </td>

                      {/* =========================
                          GENDER
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold whitespace-nowrap">
                          {patient.gender || "-"}
                        </span>

                      </td>

                      {/* =========================
                          MEDICAL HISTORY
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        {patient.medicalHistory ? (

                          <p
                            className="text-sm leading-5 text-slate-600 line-clamp-2"
                            title={patient.medicalHistory}
                          >
                            {patient.medicalHistory}
                          </p>

                        ) : (

                          <span className="text-sm text-slate-400 italic">
                            No medical history
                          </span>

                        )}

                      </td>

                      {/* =========================
                          ACTIONS
                      ========================= */}
                      <td className="px-6 py-5 align-middle">

                        <div className="flex items-center justify-center gap-2 whitespace-nowrap">

                          {/* EDIT */}
                          <button
                            onClick={() =>
                              onEditPatient(
                                patient.id
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 min-w-[78px] px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors"
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
                                patient.id
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 min-w-[88px] px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold transition-colors"
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

export default Patients;