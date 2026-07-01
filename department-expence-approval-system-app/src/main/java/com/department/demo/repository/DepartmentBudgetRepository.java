package com.department.demo.repository;

import com.department.demo.entity.DepartmentBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Month;
import java.util.Optional;

@Repository
public interface DepartmentBudgetRepository extends JpaRepository<DepartmentBudget, Long> {
    boolean existsByDepartmentIdAndMonthAndYear(Long departmentId, Month month, Integer year);
    boolean existsByDepartmentIdAndMonthAndYearAndIdNot(Long departmentId, Month month, Integer year, Long id);
    Optional<DepartmentBudget> findByDepartmentIdAndMonthAndYear(Long departmentId, Month month, Integer year);
    long countByDepartmentId(Long departmentId);
}
