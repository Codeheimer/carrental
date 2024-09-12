package com.thesis.carrental.utils;

import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class DisplayUtil {

    private DisplayUtil() {
    }

    public static String generateVehicleListingAge(final Instant listingDate) {
        final Instant now = Instant.now();
        final Duration duration = Duration.between(listingDate, now);
        final long hours = duration.toHours();
        final long days = duration.toDays();

        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime nowZoned = now.atZone(zoneId);
        ZonedDateTime pastZoned = listingDate.atZone(zoneId);

        Period period = Period.between(pastZoned.toLocalDate(), nowZoned.toLocalDate());
        int months = period.getMonths() + period.getYears() * 12;
        return structureListingAge(hours, days, months);
    }

    private static String structureListingAge(final long hours, final long days, final int months) {
        final String divider = ":";
        return hours + divider + days + divider + months;
    }
}
