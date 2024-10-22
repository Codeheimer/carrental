package com.thesis.carrental.utils;

import org.apache.commons.lang3.StringUtils;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

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

    public static String formatDate(final Instant date){
        return formatDate(date, null);
    }

    public static String formatDate(final Instant date, final String format){
        String formatToUse = StringUtils.defaultIfEmpty(format,"MMM, dd yyyy");
        ZonedDateTime zonedDateTime = date.atZone(ZoneId.systemDefault());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(formatToUse);
        return zonedDateTime.format(formatter);
    }
}
