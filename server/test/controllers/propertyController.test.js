import {
    createProperty,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getPropertiesByFilter,
    addPropertyImage,
    removePropertyImage,
    addPropertyAmenity,
    removePropertyAmenity
  } from '../../controllers/property/propertiesController.js';
  
  import {
    createNewProperty,
    getPropertyByIdService,
    updatePropertyService,
    deletePropertyService,
    getPropertiesByFilterService,
    addPropertyImageService,
    removePropertyImageService,
    addPropertyAmenityService,
    removePropertyAmenityService
  } from '../../services/propertyService.js';
  
  jest.mock('../../services/propertyService.js'); // Mock all services
  
  describe('Property Controller', () => {
    let req, res, next;
  
    beforeEach(() => {
      req = { params: {}, body: {}, query: {}, user: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createProperty', () => {
      it('should create a new property and return success response', async () => {
        const mockProperty = { _id: '123', title: 'Test Property' };
        createNewProperty.mockResolvedValue(mockProperty);
  
        await createProperty(req, res, next);
  
        expect(createNewProperty).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Property created successfully.',
          data: mockProperty,
        });
      });
  
      it('should handle errors in createProperty and call next with error', async () => {
        const mockError = new Error('Test error');
        createNewProperty.mockRejectedValue(mockError);
  
        await createProperty(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('getPropertyById', () => {
      it('should retrieve a property by ID and return success response', async () => {
        const mockProperty = { _id: '123', title: 'Test Property' };
        req.params.id = '123';
        getPropertyByIdService.mockResolvedValue(mockProperty);
  
        await getPropertyById(req, res, next);
  
        expect(getPropertyByIdService).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockProperty,
        });
      });
  
      it('should handle errors in getPropertyById and call next with error', async () => {
        const mockError = new Error('Test error');
        getPropertyByIdService.mockRejectedValue(mockError);
  
        await getPropertyById(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('updateProperty', () => {
      it('should update a property and return success response', async () => {
        const mockUpdatedProperty = { _id: '123', title: 'Updated Property' };
        req.params.id = '123';
        req.body = { title: 'Updated Property' };
        req.user = { role: 'admin' };
  
        updatePropertyService.mockResolvedValue(mockUpdatedProperty);
  
        await updateProperty(req, res, next);
  
        expect(updatePropertyService).toHaveBeenCalledWith('123', req.body, 'admin');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Property information updated successfully.',
          data: mockUpdatedProperty,
        });
      });
  
      it('should handle errors in updateProperty and call next with error', async () => {
        const mockError = new Error('Test error');
        updatePropertyService.mockRejectedValue(mockError);
  
        await updateProperty(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('deleteProperty', () => {
      it('should delete a property and return success response', async () => {
        req.params.id = '123';
        deletePropertyService.mockResolvedValue(true);
  
        await deleteProperty(req, res, next);
  
        expect(deletePropertyService).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Property deleted and references updated successfully!',
        });
      });
  
      it('should handle errors in deleteProperty and call next with error', async () => {
        const mockError = new Error('Test error');
        deletePropertyService.mockRejectedValue(mockError);
  
        await deleteProperty(req, res, next);
  
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  });
  