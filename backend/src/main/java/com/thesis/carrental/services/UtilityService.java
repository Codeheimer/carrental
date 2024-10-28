package com.thesis.carrental.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thesis.carrental.entities.AddressLocation;
import com.thesis.carrental.enums.AddressLocationType;
import com.thesis.carrental.repositories.AddressLocationRepository;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.thesis.carrental.enums.AddressLocationType.*;

@Service
public class UtilityService {

    private static final String REGION_NAME_KEY = "region_name";
    private static final String PROVINCE_LIST_KEY = "province_list";
    private static final String MUNICIPALITY_LIST_KEY = "municipality_list";
    private static final String BARANGAY_LIST_KEY = "barangay_list";

    private final AddressLocationRepository addressLocationRepository;

    @Autowired
    public UtilityService(final AddressLocationRepository addressLocationRepository) {
        this.addressLocationRepository = addressLocationRepository;
    }

    public List<AddressLocation> getByType(
        final AddressLocationType type,
        final AddressLocationType parentType,
        final String parentValue){
        if(Objects.nonNull(parentType) && StringUtils.isNoneEmpty(parentValue)){
            return addressLocationRepository.fetchByParentTypeParentNameAndType(type,parentType,parentValue);
        }
        return addressLocationRepository.fetchByType(type);
    }

    public void processAddress(final MultipartFile json) throws IOException {
        if (Objects.isNull(json)) {
            throw new FileUploadException("No file uploaded");
        }
        final ObjectMapper objectMapper = new ObjectMapper();
        final String jsonStr = new String(json.getBytes());
        final Map<String, Object> map = objectMapper.readValue(jsonStr, new TypeReference<>() {});
        final List<AddressLocation> list = processAddressHierarchy(map);

        if (!list.isEmpty()) {
            clearAndInsert(list);
        }
    }

    private List<AddressLocation> processAddressHierarchy(Map<String, Object> topLevelMap) {
        List<AddressLocation> locations = new ArrayList<>();
        processLevel(topLevelMap, null, locations, REGION);
        return locations;
    }

    @SuppressWarnings("unchecked")
    private void processLevel(
        Object currentValue, AddressLocation parent,
        List<AddressLocation> topLevelList, AddressLocationType currentType
    ) {
        switch (currentType) {
            case REGION -> {
                Map<String, Object> regions = castToMap(currentValue);
                for (Map.Entry<String, Object> entry : regions.entrySet()) {
                    Map<String, Object> regionData = castToMap(entry.getValue());
                    AddressLocation region = createLocation(
                        String.valueOf(regionData.get(REGION_NAME_KEY)),
                        REGION,
                        parent
                    );
                    topLevelList.add(region);
                    processLevel(regionData.get(PROVINCE_LIST_KEY), region,
                        topLevelList, PROVINCE
                    );
                }
            }
            case PROVINCE -> {
                Map<String, Object> provinces = castToMap(currentValue);
                for (Map.Entry<String, Object> entry : provinces.entrySet()) {
                    AddressLocation province = createLocation(
                        entry.getKey(),
                        PROVINCE,
                        parent
                    );
                    parent.getChildren().add(province);
                    processLevel(
                        castToMap(entry.getValue()).get(MUNICIPALITY_LIST_KEY),
                        province,
                        topLevelList,
                        MUNICIPALITY
                    );
                }
            }
            case MUNICIPALITY -> {
                Map<String, Object> municipalities = castToMap(currentValue);
                for (Map.Entry<String, Object> entry : municipalities.entrySet()) {
                    AddressLocation municipality = createLocation(
                        entry.getKey(),
                        MUNICIPALITY,
                        parent
                    );
                    parent.getChildren().add(municipality);
                    processLevel(
                        castToMap(entry.getValue()).get(BARANGAY_LIST_KEY),
                        municipality,
                        topLevelList,
                        BARANGAY
                    );
                }
            }
            case BARANGAY -> {
                List<String> barangays = (List<String>) currentValue;
                for (String barangayName : barangays) {
                    AddressLocation barangay = createLocation(
                        barangayName,
                        BARANGAY,
                        parent
                    );
                    parent.getChildren().add(barangay);
                }
            }
        }
    }

    private AddressLocation createLocation(
        String name, AddressLocationType type,
        AddressLocation parent
    ) {
        AddressLocation location = new AddressLocation();
        location.setName(name);
        location.setType(type);
        location.setParent(parent);
        return location;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> castToMap(final Object obj) {
        return ((Map<String, Object>) obj);
    }

    @Transactional
    private void clearAndInsert(final List<AddressLocation> list){
        addressLocationRepository.deleteAll();
        addressLocationRepository.saveAll(list);
    }
}
