package com.deloitte.market.model;

public record WhatIfResponse(
        double predictedPrice,
        WhatIfRequest features) {
}
