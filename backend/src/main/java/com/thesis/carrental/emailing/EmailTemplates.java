package com.thesis.carrental.emailing;

import com.thesis.carrental.enums.EmailTypes;

import java.util.HashMap;
import java.util.Map;

import static com.thesis.carrental.enums.EmailTypes.VEHICLE_FEEDBACK;

public class EmailTemplates {
    public static final String FROM_EMAIL = "carrental@email.com";

    public static Map<EmailTypes,EmailTemplate> TEMPLATES = new HashMap<>();
    static {
        TEMPLATES.put(VEHICLE_FEEDBACK,new EmailTemplate("Thank you for renting!","vehicle-feedback.html"));
    }
}
