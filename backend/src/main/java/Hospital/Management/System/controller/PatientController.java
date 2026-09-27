package Hospital.Management.System.controller;

import Hospital.Management.System.model.Patient;
import Hospital.Management.System.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient) {

        return patientService.getPatientById(id)
                .map(existingPatient -> {

                    existingPatient.setName(patient.getName());
                    existingPatient.setEmail(patient.getEmail());
                    existingPatient.setPhone(patient.getPhone());
                    existingPatient.setAddress(patient.getAddress());
                    existingPatient.setAge(patient.getAge());
                    existingPatient.setGender(patient.getGender());

                    // Medical History update
                    existingPatient.setMedicalHistory(
                            patient.getMedicalHistory()
                    );

                    Patient updatedPatient =
                            patientService.savePatient(existingPatient);

                    return ResponseEntity.ok(updatedPatient);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}