package com.deloitte.market.model;

import java.util.Map;

public record MarketStats(
        int totalProperties,
        double avgPrice,
        double minPrice,
        double maxPrice,
        double avgSquareFootage,
        double avgSchoolRating,
        Map<String, Double> priceByBedrooms,
        Map<String, Double> priceByDecade,
        Map<String, Long> countByBedrooms) {
}
