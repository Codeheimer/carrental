package com.thesis.carrental.services;

import com.thesis.carrental.dtos.DistanceBody;
import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    public DistanceBody calculate(final DistanceBody distanceBody) {
        final Double lat1 = distanceBody.lat1();
        final Double long1 = distanceBody.long1();
        final Double lat2 = distanceBody.lat2();
        final Double long2 = distanceBody.long2();
        final double distance = calculateDistance(lat1,long1,lat2,long2);
        return new DistanceBody(lat1,long1,lat2,long2,distance);
    }

    //https://www.geodatasource.com/developers/java
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        } else {
            double theta = lon1 - lon2;
            double dist =
                Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) + Math.cos(
                Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(Math.toRadians(
                theta));
            dist = Math.acos(dist);
            dist = Math.toDegrees(dist);
            dist = dist * 1.609344;
            return (dist);
        }
    }
}
