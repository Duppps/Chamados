package com.chamados.api.Controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.Metamodel;
import jakarta.persistence.metamodel.SingularAttribute;


@RestController
@RequestMapping("/forms")
public class FormController {
	
	 @Autowired
	 private EntityManagerFactory entityManagerFactory;
	
    @GetMapping("/{entityName}")
    public List<String> getEntityFields(@PathVariable String entityName) {
    	List<String> fields = new ArrayList<>();
    	
    	EntityManager entityManager = entityManagerFactory.createEntityManager();    
		
    	try {
    		Metamodel metamodel = entityManager.getMetamodel();
    		
    		for (EntityType<?> entityType : metamodel.getEntities()) {
    			if (entityType.getName().equals(entityName)) {
                    for (SingularAttribute<?, ?> attribute : entityType.getDeclaredSingularAttributes()) {
                        fields.add(attribute.getName() + " (" + attribute.getType().getJavaType().getSimpleName() + ")");
                    }
                    break;
                }
    		}
    	} finally {
            entityManager.close();
        }	
    	
    	fields.add("sfa");
    	
    	System.out.println(fields);
    	
    	return fields;
    }  
}
