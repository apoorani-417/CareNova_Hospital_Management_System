import { useEffect, useState } from "react";

function AddMedicalRecord({ onBack }) {
  const [record, setRecord] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    recordDate: "",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);

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
      alert("Failed to load patients");
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);

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
      alert("Failed to load doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    setRecord({
      ...record,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/medical-records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...record,
            patientId: Number(record.patientId),
            doctorId: Number(record.doctorId),
          }),
        }
      );

      if (response.ok) {
        alert("Medical record added successfully!");
        onBack();
      } else {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        alert("Failed to add medical record");
      }
    } catch (error) {
      console.error("Error adding medical record:", error);
      alert("Backend connection error");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Add Medical Record
        </h1>

        <p className="text-gray-500 mt-1">
          Add a new patient medical record
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Patient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>

              <select
                name="patientId"
                value={record.patientId}
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
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
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
                value={record.doctorId}
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
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.name}
                    {doctor.specialization
                      ? ` - ${doctor.specialization}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>

            <input
              type="text"
              name="diagnosis"
              value={record.diagnosis}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter diagnosis"
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment
            </label>

            <textarea
              name="treatment"
              value={record.treatment}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter treatment"
            ></textarea>
          </div>

          {/* Prescription */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription
            </label>

            <textarea
              name="prescription"
              value={record.prescription}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter prescription"
            ></textarea>
          </div>

          {/* Record Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Date
            </label>

            <input
              type="date"
              name="recordDate"
              value={record.recordDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Medical Record
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

export default AddMedicalRecord;