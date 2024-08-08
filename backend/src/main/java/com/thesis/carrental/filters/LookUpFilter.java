package com.thesis.carrental.filters;

import com.thesis.carrental.enums.LookUpType;

import java.util.List;

public record LookUpFilter(
    List<LookUpType> types
) {}
