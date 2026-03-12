package com.deloitte.market.model;

public record WhatIfRequest(
        double squareFootage,
        int bedrooms,
        double bathrooms,
        int yearBuilt,
        double lotSize,
        double distanceToCityCenter,
        double schoolRating) {
}
