package com.deloitte.market.controller;

import com.deloitte.market.model.MarketStats;
import com.deloitte.market.model.Property;
import com.deloitte.market.model.WhatIfRequest;
import com.deloitte.market.model.WhatIfResponse;
import com.deloitte.market.service.MarketService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "healthy", "service", "market-analysis-api");
    }

    @GetMapping("/stats")
    public MarketStats stats() {
        return marketService.getStats();
    }

    @GetMapping("/properties")
    public List<Property> properties(
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "price") String sort,
            @RequestParam(defaultValue = "asc") String order) {
        return marketService.getProperties(bedrooms, minYear, maxYear, minPrice, maxPrice, sort, order);
    }

    @PostMapping("/what-if")
    public WhatIfResponse whatIf(@RequestBody WhatIfRequest request) {
        return marketService.whatIf(request);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv() {
        String csv = marketService.exportCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "housing-data.csv");
        return ResponseEntity.ok().headers(headers).body(csv);
    }
}
