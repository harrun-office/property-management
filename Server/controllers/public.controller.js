const Property = require('../models/property.model');

exports.getAllProperties = async (req, res) => {
  try {
    const {
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      status = 'LISTED',
      location,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filters = { status };

    if (propertyType) filters.property_type = propertyType;
    if (minPrice) filters.min_price = parseFloat(minPrice);
    if (maxPrice) filters.max_price = parseFloat(maxPrice);
    if (bedrooms) filters.min_bedrooms = parseInt(bedrooms);
    if (location) filters.location = location;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get properties from database
    const properties = await Property.findAllWithFilters(filters, parseInt(limit), offset);

    // Get total count for pagination
    const totalCount = await Property.getCountWithFilters(filters);

    res.json({
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      error: 'Server error fetching properties',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);

    if (!propertyId || propertyId <= 0) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Only return listed properties for public access
    if (property.status !== 'LISTED') {
      return res.status(404).json({ error: 'Property not available' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Server error fetching property' });
  }
};

