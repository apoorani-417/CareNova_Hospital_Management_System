import { useEffect, useState } from "react";

function EditAppointment({ appointmentId, onBack }) {
  const [appointment, setAppointment] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Scheduled",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetchAppointment();
    fetchPatients();
    fetchDoctors();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${appointmentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointment");
      }

      const data = await response.json();

      setAppointment({
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        reason: data.reason,
        status: data.status,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      alert("Failed to load appointment");
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/patients"
      );

      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/doctors"
      );

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error("Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...appointment,
            patientId: Number(appointment.patientId),
            doctorId: Number(appointment.doctorId),
          }),
        }
      );

      if (response.ok) {
        alert("Appointment updated successfully!");
        onBack();
      } else {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        alert("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Backend connection error");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading appointment...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Appointment
        </h1>

        <p className="text-gray-500 mt-1">
          Update appointment details
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Patient + Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Patient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>

              <select
                name="patientId"
                value={appointment.patientId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="">
                  {loadingPatients
                    ? "Loading patients..."
                    : "Select Patient"}
                </option>

                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor
              </label>

              <select
                name="doctorId"
                value={appointment.doctorId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="">
                  {loadingDoctors
                    ? "Loading doctors..."
                    : "Select Doctor"}
                </option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                    {doctor.specialization
                      ? ` - ${doctor.specialization}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date
              </label>

              <input
                type="date"
                name="appointmentDate"
                value={appointment.appointmentDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time
              </label>

              <input
                type="time"
                name="appointmentTime"
                value={appointment.appointmentTime}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>

            <textarea
              name="reason"
              value={appointment.reason}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            ></textarea>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>

            <select
              name="status"
              value={appointment.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Appointment
            </button>

            <button
              type="button"
              onClick={onBack}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
            >
              Back
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditAppointment;