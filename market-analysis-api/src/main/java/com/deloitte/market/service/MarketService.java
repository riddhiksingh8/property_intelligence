package com.deloitte.market.service;

import com.deloitte.market.model.MarketStats;
import com.deloitte.market.model.Property;
import com.deloitte.market.model.WhatIfRequest;
import com.deloitte.market.model.WhatIfResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class MarketService {

    private final HousingDataService dataService;
    private final MlModelClient mlModelClient;

    public MarketService(HousingDataService dataService, MlModelClient mlModelClient) {
        this.dataService = dataService;
        this.mlModelClient = mlModelClient;
    }

    @Cacheable("market-stats")
    public MarketStats getStats() {
        List<Property> props = dataService.getAll();

        double avgPrice = round2(props.stream().mapToDouble(Property::price).average().orElse(0));
        double minPrice = props.stream().mapToDouble(Property::price).min().orElse(0);
        double maxPrice = props.stream().mapToDouble(Property::price).max().orElse(0);
        double avgSqft  = round2(props.stream().mapToDouble(Property::squareFootage).average().orElse(0));
        double avgSchool = round2(props.stream().mapToDouble(Property::schoolRating).average().orElse(0));

        Map<String, Double> priceByBedrooms = new TreeMap<>(
            props.stream()
                 .collect(Collectors.groupingBy(
                     p -> String.valueOf(p.bedrooms()),
                     Collectors.averagingDouble(Property::price)
                 ))
        );
        priceByBedrooms.replaceAll((k, v) -> round2(v));

        Map<String, Double> priceByDecade = new TreeMap<>(
            props.stream()
                 .collect(Collectors.groupingBy(
                     p -> (p.yearBuilt() / 10 * 10) + "s",
                     Collectors.averagingDouble(Property::price)
                 ))
        );
        priceByDecade.replaceAll((k, v) -> round2(v));

        Map<String, Long> countByBedrooms = new TreeMap<>(
            props.stream()
                 .collect(Collectors.groupingBy(
                     p -> String.valueOf(p.bedrooms()),
                     Collectors.counting()
                 ))
        );

        return new MarketStats(
            props.size(), avgPrice, minPrice, maxPrice,
            avgSqft, avgSchool,
            priceByBedrooms, priceByDecade, countByBedrooms
        );
    }

    @Cacheable(value = "properties",
               key = "#bedrooms + '-' + #minYear + '-' + #maxYear + '-' + #minPrice + '-' + #maxPrice + '-' + #sort + '-' + #order")
    public List<Property> getProperties(Integer bedrooms, Integer minYear, Integer maxYear,
                                         Double minPrice, Double maxPrice,
                                         String sort, String order) {
        return dataService.filter(bedrooms, minYear, maxYear, minPrice, maxPrice, sort, order);
    }

    public WhatIfResponse whatIf(WhatIfRequest request) {
        double predicted = mlModelClient.predict(request);
        return new WhatIfResponse(round2(predicted), request);
    }

    public String exportCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("id,square_footage,bedrooms,bathrooms,year_built,lot_size,distance_to_city_center,school_rating,price\n");
        for (Property p : dataService.getAll()) {
            sb.append(p.id()).append(',')
              .append(p.squareFootage()).append(',')
              .append(p.bedrooms()).append(',')
              .append(p.bathrooms()).append(',')
              .append(p.yearBuilt()).append(',')
              .append(p.lotSize()).append(',')
              .append(p.distanceToCityCenter()).append(',')
              .append(p.schoolRating()).append(',')
              .append(p.price()).append('\n');
        }
        return sb.toString();
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
