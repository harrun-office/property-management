const data = require('../data/mockData');

const { properties } = data;

exports.getAllProperties = (req, res) => {
  try {
    const { propertyType, minPrice, maxPrice, bedrooms } = req.query;
    let filteredProperties = [...properties];

    // Apply filters
    if (propertyType) {
      filteredProperties = filteredProperties.filter(p => p.propertyType === propertyType);
    }
    if (minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= parseInt(maxPrice));
    }
    if (bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= parseInt(bedrooms));
    }

    res.json(filteredProperties);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching properties' });
  }
};

exports.getPropertyById = (req, res) => {
  try {
    const property = properties.find(p => p.id === parseInt(req.params.id));
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching property' });
  }
};

