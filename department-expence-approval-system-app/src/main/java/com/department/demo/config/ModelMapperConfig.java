package com.department.demo.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.department.demo.entity.ExpenseClaim;
import com.department.demo.dto.ExpenseClaimResponseDTO;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        modelMapper.typeMap(ExpenseClaim.class, ExpenseClaimResponseDTO.class)
                .addMapping(src -> src.getDepartment().getDepartmentName(), ExpenseClaimResponseDTO::setDepartment);

        return modelMapper;
    }
}
