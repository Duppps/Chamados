package com.chamados.api.Controllers;

import com.chamados.api.DTO.FormDTO;
import com.chamados.api.Entities.Form;
import com.chamados.api.Repositories.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("forms")
public class FormController {
    @Autowired
    FormRepository formRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(formRepository.findAll());
    }

    @GetMapping("/pageable")
    public ResponseEntity<Page<Form>> getAllPageable(Pageable pageable) {
        Page<Form> form = formRepository.findAll(pageable);
        return ResponseEntity.ok(form);
    }

    @PostMapping("/")
    public ResponseEntity<?> createForm(@RequestBody FormDTO formDTO) {
        Form form = new Form(formDTO.name(), formDTO.ticketCategory());
        formRepository.save(form);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{formID}")
    public ResponseEntity<?> getForm(@PathVariable Long formID) {
        Optional<Form> optionalForm = formRepository.findById(formID);

        if (optionalForm.isPresent()) {
            Form form = optionalForm.get();
            return ResponseEntity.ok(form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{formID}")
    public ResponseEntity<?> deleteForm(@PathVariable Long formID) {
        Optional<Form> optionalForm = formRepository.findById(formID);

        if (optionalForm.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            formRepository.deleteById(formID);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Não é possível excluir o formulário devido a registros associados.");
        }
    }

    @PutMapping("/{formID}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long formID, @RequestBody FormDTO formDTO) {
        Optional<Form> optionalForm = formRepository.findById(formID);

        if (optionalForm.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Form form = optionalForm.get();
        form.setName(formDTO.name());
        form.setTicketCategory(formDTO.ticketCategory());
        formRepository.save(form);

        return ResponseEntity.ok().build();
    }
}
