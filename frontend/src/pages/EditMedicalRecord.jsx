import { useEffect, useState } from "react";

function EditMedicalRecord({ recordId, onBack }) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    recordDate: "",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD RECORD + PATIENTS + DOCTORS
  // ==========================================
  useEffect(() => {
    const loadData = async () => {
      if (!recordId) {
        console.error("Medical record ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all three APIs
        const [
          recordResponse,
          patientsResponse,
          doctorsResponse,
        ] = await Promise.all([
          fetch(
            `http://localhost:8080/api/medical-records/${recordId}`
          ),
          fetch(
            "http://localhost:8080/api/patients"
          ),
          fetch(
            "http://localhost:8080/api/doctors"
          ),
        ]);

        // Check medical record
        if (!recordResponse.ok) {
          throw new Error(
            `Medical record error: ${recordResponse.status}`
          );
        }

        // Check patients
        if (!patientsResponse.ok) {
          throw new Error(
            `Patients error: ${patientsResponse.status}`
          );
        }

        // Check doctors
        if (!doctorsResponse.ok) {
          throw new Error(
            `Doctors error: ${doctorsResponse.status}`
          );
        }

        const recordData =
          await recordResponse.json();

        const patientsData =
          await patientsResponse.json();

        const doctorsData =
          await doctorsResponse.json();

        console.log(
          "EDIT MEDICAL RECORD:",
          recordData
        );

        console.log(
          "PATIENTS:",
          patientsData
        );

        console.log(
          "DOCTORS:",
          doctorsData
        );

        // Store patients
        setPatients(
          Array.isArray(patientsData)
            ? patientsData
            : []
        );

        // Store doctors
        setDoctors(
          Array.isArray(doctorsData)
            ? doctorsData
            : []
        );

        // IMPORTANT:
        // Keep IDs as strings for select value
        setFormData({
          patientId:
            recordData.patientId !== null &&
            recordData.patientId !== undefined
              ? String(recordData.patientId)
              : "",

          doctorId:
            recordData.doctorId !== null &&
            recordData.doctorId !== undefined
              ? String(recordData.doctorId)
              : "",

          diagnosis:
            recordData.diagnosis || "",

          treatment:
            recordData.treatment || "",

          prescription:
            recordData.prescription || "",

          recordDate:
            recordData.recordDate || "",
        });
      } catch (error) {
        console.error(
          "Error loading medical record:",
          error
        );

        alert(
          "Failed to load medical record data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [recordId]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE MEDICAL RECORD
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Patient
    if (!formData.patientId) {
      alert("Please select a patient");
      return;
    }

    // Validate Doctor
    if (!formData.doctorId) {
      alert("Please select a doctor");
      return;
    }

    if (!formData.diagnosis.trim()) {
      alert("Please enter diagnosis");
      return;
    }

    if (!formData.treatment.trim()) {
      alert("Please enter treatment");
      return;
    }

    if (!formData.prescription.trim()) {
      alert("Please enter prescription");
      return;
    }

    if (!formData.recordDate) {
      alert("Please select record date");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        patientId: Number(formData.patientId),
        doctorId: Number(formData.doctorId),
        diagnosis: formData.diagnosis.trim(),
        treatment: formData.treatment.trim(),
        prescription: formData.prescription.trim(),
        recordDate: formData.recordDate,
      };

      console.log(
        "Updating medical record:",
        updateData
      );

      const response = await fetch(
        `http://localhost:8080/api/medical-records/${recordId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Update response:",
        response.status,
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Update failed: ${response.status} ${responseText}`
        );
      }

      alert(
        "Medical record updated successfully!"
      );

      onBack();
    } catch (error) {
      console.error(
        "Error updating medical record:",
        error
      );

      alert(
        "Failed to update medical record"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  if (loading) {
    return (
      <div className="p-6">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Edit Medical Record
            </h3>

            <p className="text-gray-500 mt-1">
              Update patient medical record details
            </p>
          </div>

          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>

        </div>

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <div className="inline-block w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

          <p className="mt-4 text-gray-500">
            Loading medical record...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Edit Medical Record
          </h3>

          <p className="text-gray-500 mt-1">
            Update patient medical record details
          </p>
        </div>

        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* =================================
              PATIENT
          ================================= */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Patient
            </label>

            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >

              <option value="">
                Select Patient
              </option>

              {patients.map((patient) => (
                <option
                  key={patient.id}
                  value={String(patient.id)}
                >
                  {patient.name}
                </option>
              ))}

            </select>

            {/* Existing Patient ID */}
            {formData.patientId && (
              <p className="text-xs text-gray-400 mt-1">
                Patient ID: {formData.patientId}
              </p>
            )}

          </div>

          {/* =================================
              DOCTOR
          ================================= */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Doctor
            </label>

            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >

              <option value="">
                Select Doctor
              </option>

              {doctors.map((doctor) => (
                <option
                  key={doctor.id}
                  value={String(doctor.id)}
                >
                  {doctor.name}
                  {doctor.specialization
                    ? ` - ${doctor.specialization}`
                    : ""}
                </option>
              ))}

            </select>

            {/* Existing Doctor ID */}
            {formData.doctorId && (
              <p className="text-xs text-gray-400 mt-1">
                Doctor ID: {formData.doctorId}
              </p>
            )}

          </div>

          {/* =================================
              DIAGNOSIS
          ================================= */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Diagnosis
            </label>

            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

          </div>

          {/* =================================
              TREATMENT
          ================================= */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Treatment
            </label>

            <input
              type="text"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

          </div>

          {/* =================================
              PRESCRIPTION
          ================================= */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Prescription
            </label>

            <input
              type="text"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

          </div>

          {/* =================================
              RECORD DATE
          ================================= */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Record Date
            </label>

            <input
              type="date"
              name="recordDate"
              value={formData.recordDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />

          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">

          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg text-white ${
              saving
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving
              ? "Updating..."
              : "Update Medical Record"}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            Back
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditMedicalRecord;