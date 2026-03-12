package com.deloitte.market.service;

import com.deloitte.market.model.Property;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
public class HousingDataService {

    private final List<Property> properties;

    public HousingDataService() {
        properties = List.of(
            new Property(1,  1250, 2, 1.0, 1985, 5200,  3.2, 7.1, 185000),
            new Property(2,  1850, 3, 2.0, 1998, 7500,  5.6, 8.2, 265000),
            new Property(3,  1420, 3, 2.0, 1992, 6800,  2.8, 6.9, 210000),
            new Property(4,  2100, 4, 2.5, 2005, 9200,  7.3, 8.5, 345000),
            new Property(5,  1700, 3, 2.0, 2001, 7100,  4.1, 7.8, 275000),
            new Property(6,   980, 2, 1.0, 1978, 4500,  2.5, 6.5, 165000),
            new Property(7,  2400, 4, 3.0, 2010, 10500, 8.2, 9.0, 410000),
            new Property(8,  1600, 3, 1.5, 1995, 6700,  3.8, 7.2, 225000),
            new Property(9,  2200, 4, 2.5, 2008, 9800,  6.9, 8.7, 375000),
            new Property(10, 1350, 3, 1.0, 1987, 5800,  3.0, 7.0, 195000),
            new Property(11, 1950, 3, 2.0, 2003, 8100,  5.2, 8.1, 285000),
            new Property(12, 1100, 2, 1.0, 1982, 4800,  2.1, 6.8, 175000),
            new Property(13, 2350, 4, 3.0, 2012, 10200, 7.8, 9.1, 400000),
            new Property(14, 1550, 3, 1.5, 1994, 6500,  3.6, 7.3, 220000),
            new Property(15, 2050, 4, 2.5, 2006, 9000,  6.7, 8.6, 355000),
            new Property(16, 1300, 2, 1.0, 1986, 5500,  2.9, 7.2, 190000),
            new Property(17, 1800, 3, 2.0, 1999, 7300,  4.9, 8.0, 260000),
            new Property(18, 1150, 2, 1.0, 1980, 4600,  2.3, 6.7, 170000),
            new Property(19, 2300, 4, 3.0, 2011, 10000, 7.5, 9.0, 395000),
            new Property(20, 1500, 3, 1.5, 1993, 6400,  3.5, 7.4, 215000),
            new Property(21, 1650, 3, 2.0, 1997, 7000,  4.0, 7.7, 240000),
            new Property(22, 2150, 4, 2.5, 2007, 9500,  7.0, 8.8, 365000),
            new Property(23, 1200, 2, 1.0, 1984, 5000,  2.6, 6.9, 180000),
            new Property(24, 1900, 3, 2.0, 2002, 7800,  5.0, 8.3, 280000),
            new Property(25, 1400, 3, 1.5, 1990, 6000,  3.2, 7.1, 205000),
            new Property(26, 2250, 4, 3.0, 2009, 9900,  7.2, 8.9, 385000),
            new Property(27, 1750, 3, 2.0, 2000, 7200,  4.5, 7.9, 255000),
            new Property(28, 1050, 2, 1.0, 1979, 4400,  2.2, 6.6, 160000),
            new Property(29, 2050, 4, 2.5, 2004, 8800,  6.5, 8.4, 335000),
            new Property(30, 1450, 3, 1.5, 1991, 6200,  3.4, 7.5, 215000),
            new Property(31, 1330, 2, 1.0, 1988, 5600,  3.1, 7.0, 195000),
            new Property(32, 1870, 3, 2.0, 2000, 7600,  5.0, 8.1, 270000),
            new Property(33, 1380, 3, 1.5, 1992, 6100,  3.2, 7.3, 205000),
            new Property(34, 2120, 4, 2.5, 2006, 9300,  7.1, 8.6, 350000),
            new Property(35, 1680, 3, 2.0, 1998, 7050,  4.2, 7.6, 250000),
            new Property(36, 1010, 2, 1.0, 1980, 4550,  2.4, 6.7, 170000),
            new Property(37, 2380, 4, 3.0, 2011, 10300, 7.9, 9.0, 405000),
            new Property(38, 1580, 3, 1.5, 1996, 6650,  3.7, 7.2, 230000),
            new Property(39, 2180, 4, 2.5, 2007, 9700,  6.8, 8.7, 370000),
            new Property(40, 1270, 2, 1.0, 1985, 5300,  2.8, 7.0, 190000),
            new Property(41, 1930, 3, 2.0, 2002, 8000,  5.3, 8.2, 290000),
            new Property(42, 1120, 2, 1.0, 1983, 4850,  2.2, 6.9, 175000),
            new Property(43, 2320, 4, 3.0, 2010, 10100, 7.7, 9.0, 390000),
            new Property(44, 1520, 3, 1.5, 1995, 6350,  3.5, 7.4, 225000),
            new Property(45, 2070, 4, 2.5, 2005, 9100,  6.6, 8.5, 345000),
            new Property(46, 1290, 2, 1.0, 1986, 5400,  3.0, 7.1, 195000),
            new Property(47, 1820, 3, 2.0, 1999, 7400,  4.8, 8.0, 265000),
            new Property(48, 1130, 2, 1.0, 1981, 4700,  2.3, 6.8, 170000),
            new Property(49, 2280, 4, 3.0, 2009, 9950,  7.4, 8.9, 385000),
            new Property(50, 1480, 3, 1.5, 1992, 6300,  3.4, 7.5, 220000)
        );
    }

    public List<Property> getAll() {
        return properties;
    }

    public List<Property> filter(Integer bedrooms, Integer minYear, Integer maxYear,
                                  Double minPrice, Double maxPrice,
                                  String sort, String order) {
        Stream<Property> stream = properties.stream();

        if (bedrooms != null)  stream = stream.filter(p -> p.bedrooms() == bedrooms);
        if (minYear  != null)  stream = stream.filter(p -> p.yearBuilt() >= minYear);
        if (maxYear  != null)  stream = stream.filter(p -> p.yearBuilt() <= maxYear);
        if (minPrice != null)  stream = stream.filter(p -> p.price() >= minPrice);
        if (maxPrice != null)  stream = stream.filter(p -> p.price() <= maxPrice);

        Comparator<Property> comparator = switch (sort == null ? "price" : sort) {
            case "square_footage" -> Comparator.comparingDouble(Property::squareFootage);
            case "year_built"     -> Comparator.comparingInt(Property::yearBuilt);
            case "school_rating"  -> Comparator.comparingDouble(Property::schoolRating);
            case "bedrooms"       -> Comparator.comparingInt(Property::bedrooms);
            default               -> Comparator.comparingDouble(Property::price);
        };

        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }

        return stream.sorted(comparator).toList();
    }
}
