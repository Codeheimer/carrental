package com.thesis.carrental.enums;

import java.util.Map;

public enum AddressLocationType {
    REGION, PROVINCE, MUNICIPALITY, BARANGAY;

    public static Map<Integer, AddressLocationType> getByDepth() {
        return Map.of(0, REGION, 1, PROVINCE, 2, MUNICIPALITY, 3, BARANGAY);
    }
}
