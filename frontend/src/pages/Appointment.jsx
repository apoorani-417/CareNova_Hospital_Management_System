import { useEffect, useState } from "react";

function Appointments({ onAddAppointment, onEditAppointment }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/appointments"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/patients"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/doctors"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const getPatientName = (patientId) => {
    const patient = patients.find(
      (patient) => Number(patient.id) === Number(patientId)
    );

    return patient ? patient.name : `Patient #${patientId}`;
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(
      (doctor) => Number(doctor.id) === Number(doctorId)
    );

    return doctor ? doctor.name : `Doctor #${doctorId}`;
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAppointments((currentAppointments) =>
          currentAppointments.filter(
            (appointment) => appointment.id !== id
          )
        );

        alert("Appointment deleted successfully!");
      } else {
        alert("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Backend connection error");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const search = searchTerm.toLowerCase();

    const patientName = getPatientName(
      appointment.patientId
    ).toLowerCase();

    const doctorName = getDoctorName(
      appointment.doctorId
    ).toLowerCase();

    return (
      String(appointment.id).includes(search) ||
      patientName.includes(search) ||
      doctorName.includes(search) ||
      String(appointment.patientId).includes(search) ||
      String(appointment.doctorId).includes(search) ||
      appointment.appointmentDate
        ?.toLowerCase()
        .includes(search) ||
      appointment.appointmentTime
        ?.toLowerCase()
        .includes(search) ||
      appointment.reason?.toLowerCase().includes(search) ||
      appointment.status?.toLowerCase().includes(search)
    );
  });

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "scheduled") {
      return "bg-blue-50 text-blue-700";
    }

    if (normalizedStatus === "completed") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (normalizedStatus === "cancelled") {
      return "bg-red-50 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Appointment Management
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Schedule and manage patient appointments
          </p>
        </div>

        <button
          onClick={onAddAppointment}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md"
        >
          <span className="text-xl leading-none">+</span>
          New Appointment
        </button>

      </div>

      {/* Search + Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

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
              <circle cx="11" cy="11" r="8" />

              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>

            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white"
            />

          </div>

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              {appointments.length}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Total Appointments
              </p>

              <p className="text-xs text-slate-400">
                Scheduled in system
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Appointment Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200">

          <h3 className="font-bold text-slate-800">
            Appointment List
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? "s" : ""} found
          </p>

        </div>

        {loading ? (
          <div className="py-16 text-center">

            <div className="inline-block w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

            <p className="mt-4 text-sm text-slate-500">
              Loading appointments...
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1250px] table-fixed">

              {/* Fixed Column Widths */}
              <colgroup>
                <col className="w-[90px]" />
                <col className="w-[210px]" />
                <col className="w-[210px]" />
                <col className="w-[150px]" />
                <col className="w-[130px]" />
                <col className="w-[260px]" />
                <col className="w-[150px]" />
                <col className="w-[220px]" />
              </colgroup>

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
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Time
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredAppointments.length === 0 ? (
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
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="17"
                            rx="2"
                          />

                          <line
                            x1="16"
                            y1="2"
                            x2="16"
                            y2="6"
                          />

                          <line
                            x1="8"
                            y1="2"
                            x2="8"
                            y2="6"
                          />

                          <line
                            x1="3"
                            y1="10"
                            x2="21"
                            y2="10"
                          />
                        </svg>

                      </div>

                      <p className="mt-4 font-semibold text-slate-700">
                        No appointments found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try another search or create a new appointment.
                      </p>

                    </td>

                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (

                    <tr
                      key={appointment.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* ID */}
                      <td className="px-6 py-5 align-middle">

                        <span className="inline-flex items-center justify-center min-w-10 h-8 px-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                          #{appointment.id}
                        </span>

                      </td>

                      {/* Patient */}
                      <td className="px-6 py-5 align-middle">

                        <div className="min-w-0">

                          <p
                            className="text-sm font-semibold text-slate-700 truncate"
                            title={getPatientName(
                              appointment.patientId
                            )}
                          >
                            {getPatientName(
                              appointment.patientId
                            )}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {appointment.patientId}
                          </p>

                        </div>

                      </td>

                      {/* Doctor */}
                      <td className="px-6 py-5 align-middle">

                        <div className="min-w-0">

                          <p
                            className="text-sm font-semibold text-slate-700 truncate"
                            title={getDoctorName(
                              appointment.doctorId
                            )}
                          >
                            {getDoctorName(
                              appointment.doctorId
                            )}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {appointment.doctorId}
                          </p>

                        </div>

                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 align-middle">

                        <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
                          {appointment.appointmentDate || "-"}
                        </p>

                      </td>

                      {/* Time */}
                      <td className="px-6 py-5 align-middle">

                        <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
                          {appointment.appointmentTime || "-"}
                        </p>

                      </td>

                      {/* Reason */}
                      <td className="px-6 py-5 align-middle">

                        <p
                          className="text-sm text-slate-600 truncate"
                          title={appointment.reason || ""}
                        >
                          {appointment.reason || "-"}
                        </p>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 align-middle text-center">

                        <span
                          className={`inline-flex items-center justify-center min-w-[100px] px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                            appointment.status
                          )}`}
                        >
                          {appointment.status || "-"}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 align-middle">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() =>
                              onEditAppointment(
                                appointment.id
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

                          <button
                            onClick={() =>
                              handleDelete(
                                appointment.id
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

export default Appointments;