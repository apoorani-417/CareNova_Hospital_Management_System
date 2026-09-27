package Hospital.Management.System.service;

import Hospital.Management.System.model.MedicalRecord;
import Hospital.Management.System.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public MedicalRecord saveMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public Optional<MedicalRecord> getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id);
    }

    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }
}