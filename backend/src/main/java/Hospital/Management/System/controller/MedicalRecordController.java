package Hospital.Management.System.controller;

import Hospital.Management.System.model.MedicalRecord;
import Hospital.Management.System.service.MedicalRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping
    public MedicalRecord createMedicalRecord(
            @RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.saveMedicalRecord(medicalRecord);
    }

    @GetMapping
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordService.getAllMedicalRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(
            @PathVariable Long id) {

        return medicalRecordService.getMedicalRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecord medicalRecord) {

        return medicalRecordService.getMedicalRecordById(id)
                .map(existingRecord -> {

                    existingRecord.setPatientId(medicalRecord.getPatientId());
                    existingRecord.setDoctorId(medicalRecord.getDoctorId());
                    existingRecord.setDiagnosis(medicalRecord.getDiagnosis());
                    existingRecord.setTreatment(medicalRecord.getTreatment());
                    existingRecord.setPrescription(medicalRecord.getPrescription());
                    existingRecord.setRecordDate(medicalRecord.getRecordDate());

                    MedicalRecord updatedRecord =
                            medicalRecordService.saveMedicalRecord(existingRecord);

                    return ResponseEntity.ok(updatedRecord);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(
            @PathVariable Long id) {

        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
}