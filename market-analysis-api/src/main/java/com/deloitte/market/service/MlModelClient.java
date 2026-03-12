package com.deloitte.market.service;

import com.deloitte.market.model.WhatIfRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class MlModelClient {

    @Value("${ml.model.url}")
    private String mlModelUrl;

    private final RestTemplate restTemplate;

    public MlModelClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double predict(WhatIfRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("square_footage",          request.squareFootage());
        body.put("bedrooms",                request.bedrooms());
        body.put("bathrooms",               request.bathrooms());
        body.put("year_built",              request.yearBuilt());
        body.put("lot_size",                request.lotSize());
        body.put("distance_to_city_center", request.distanceToCityCenter());
        body.put("school_rating",           request.schoolRating());

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    mlModelUrl + "/predict",
                    HttpMethod.POST,
                    new HttpEntity<>(body),
                    new ParameterizedTypeReference<>() {}
            );
            Object price = response.getBody() != null ? response.getBody().get("predicted_price") : null;
            if (price == null) throw new RuntimeException("No predicted_price in response");
            return ((Number) price).doubleValue();
        } catch (Exception e) {
            throw new RuntimeException("ML model unavailable: " + e.getMessage(), e);
        }
    }
}
