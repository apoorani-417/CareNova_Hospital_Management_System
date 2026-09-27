package Hospital.Management.System.controller;

import Hospital.Management.System.model.Appointment;
import Hospital.Management.System.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.saveAppointment(appointment);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {

        return appointmentService.getAppointmentById(id)
                .map(existingAppointment -> {

                    existingAppointment.setPatientId(appointment.getPatientId());
                    existingAppointment.setDoctorId(appointment.getDoctorId());
                    existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
                    existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
                    existingAppointment.setReason(appointment.getReason());
                    existingAppointment.setStatus(appointment.getStatus());

                    Appointment updatedAppointment =
                            appointmentService.saveAppointment(existingAppointment);

                    return ResponseEntity.ok(updatedAppointment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}