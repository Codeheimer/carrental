package com.thesis.carrental.filters;

import org.apache.commons.lang3.StringUtils;

public record VehicleFilter(
    String search,
    String make,
    String model,
    String year,
    String engineDisplacement,
    Integer seater,
    boolean own
) {

    public boolean isEmptyFilter() {
        return (this.search == null || this.search.isEmpty()) &&
            (this.model == null || this.model.isEmpty()) &&
            (this.year == null || this.year.isEmpty()) &&
            (this.engineDisplacement == null || this.engineDisplacement.isEmpty()) &&
            (this.seater == null || String.valueOf(this.seater).isEmpty());
    }
}
