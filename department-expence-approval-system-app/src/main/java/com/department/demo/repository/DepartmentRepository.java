package com.department.demo.repository;

import com.department.demo.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByDepartmentName(String departmentName);
    boolean existsByDepartmentNameIgnoreCase(String departmentName);
    boolean existsByDepartmentNameIgnoreCaseAndIdNot(String departmentName, Long id);
}
