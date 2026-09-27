package Hospital.Management.System.controller;

import Hospital.Management.System.model.Doctor;
import Hospital.Management.System.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor) {

        return doctorService.getDoctorById(id)
                .map(existingDoctor -> {

                    existingDoctor.setName(doctor.getName());
                    existingDoctor.setEmail(doctor.getEmail());
                    existingDoctor.setPhone(doctor.getPhone());
                    existingDoctor.setSpecialization(doctor.getSpecialization());
                    existingDoctor.setGender(doctor.getGender());
                    existingDoctor.setExperience(doctor.getExperience());

                    Doctor updatedDoctor =
                            doctorService.saveDoctor(existingDoctor);

                    return ResponseEntity.ok(updatedDoctor);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}