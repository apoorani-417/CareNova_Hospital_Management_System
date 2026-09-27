package Hospital.Management.System.repository;

import Hospital.Management.System.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}