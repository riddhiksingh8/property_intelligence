export interface HouseFeatures {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

export interface EstimateRequest extends HouseFeatures {
  label?: string;
}

export interface EstimateResult {
  id: string;
  label: string | null;
  predicted_price: number;
  timestamp: string;
  features: HouseFeatures;
}

export interface Property {
  id: number;
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
  price: number;
}

export interface MarketStats {
  total_properties: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  avg_square_footage: number;
  avg_school_rating: number;
  price_by_bedrooms: Record<string, number>;
  price_by_decade: Record<string, number>;
  count_by_bedrooms: Record<string, number>;
}

export interface PropertyFilter {
  bedrooms?: number | "";
  min_year?: number | "";
  max_year?: number | "";
  min_price?: number | "";
  max_price?: number | "";
  sort?: string;
  order?: "asc" | "desc";
}
