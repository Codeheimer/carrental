package com.thesis.carrental.filters;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thesis.carrental.dtos.VehicleResult;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleFilter extends AbstractFilter {

    private static final int INDEX_START = 0;

    private String search;
    private String make;
    private String model;
    private String year;
    private String engineDisplacement;
    private int seater;
    private boolean own;

    private List<VehicleResult> result = new ArrayList<>();

    public VehicleFilter() {
    }

    public VehicleFilter(
        final String search,
        final String make,
        final String model,
        final String year,
        final String engineDisplacement,
        final int seater,
        final boolean own,
        final int pageNumber,
        final int pageSize
    ) {
        this.search = search;
        this.make = make;
        this.model = model;
        this.year = year;
        this.engineDisplacement = engineDisplacement;
        this.seater = seater;
        this.own = own;
        this.setPageNumber(pageNumber);
        this.setPageSize(pageSize);
    }

    public String getSearch() {
        return search;
    }

    public void setSearch(final String search) {
        this.search = search;
    }

    public String getMake() {
        return make;
    }

    public void setMake(final String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(final String model) {
        this.model = model;
    }

    public String getYear() {
        return year;
    }

    public void setYear(final String year) {
        this.year = year;
    }

    public String getEngineDisplacement() {
        return engineDisplacement;
    }

    public void setEngineDisplacement(final String engineDisplacement) {
        this.engineDisplacement = engineDisplacement;
    }

    public int getSeater() {
        return seater;
    }

    public void setSeater(final int seater) {
        this.seater = seater;
    }

    public boolean isOwn() {
        return own;
    }

    public void setOwn(final boolean own) {
        this.own = own;
    }

    public List<VehicleResult> getResult() {
        return result;
    }

    public void setResult(final List<VehicleResult> result) {
        this.result = result;
    }

    @Override
    public Pageable next() {
        return new VehicleFilter(
            this.search,
            this.make,
            this.model,
            this.year,
            this.engineDisplacement,
            this.seater,
            this.own,
            this.getTotalPages() == this.getPageNumber() ? INDEX_START : this.getPageNumber() + 1,
            this.getPageSize()
        );
    }

    @Override
    public Pageable previousOrFirst() {
        return new VehicleFilter(
            this.search,
            this.make,
            this.model,
            this.year,
            this.engineDisplacement,
            this.seater,
            this.own,
            this.getPageNumber() == INDEX_START ? this.getTotalPages() : this.getPageNumber() - 1,
            this.getPageSize()
        );
    }

    @Override
    public Pageable first() {
        return new VehicleFilter(
            this.search,
            this.make,
            this.model,
            this.year,
            this.engineDisplacement,
            this.seater,
            this.own,
            INDEX_START,
            this.getPageSize()
        );
    }

    @Override
    public Pageable withPage(final int pageNumber) {
        return new VehicleFilter(
            this.search,
            this.make,
            this.model,
            this.year,
            this.engineDisplacement,
            this.seater,
            this.own,
            pageNumber,
            this.getPageSize()
        );
    }

    @Override
    public boolean isFilterEmpty() {
        return (isEmpty(this.search)) &&
            (isEmpty(this.model)) &&
            (isEmpty(this.year)) &&
            (isEmpty(this.engineDisplacement)) &&
            (this.seater == 0);
    }
}
