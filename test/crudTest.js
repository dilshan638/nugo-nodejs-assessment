const { expect } = require('chai');
const sinon = require('sinon');
const moment = require('moment');

const userController = require('../controllers/registration/registration'); 
const helpers = require('../controllers/helpers/common_functions'); 
const registrationModel = require('../models/registration'); 

//Add User
describe('User Create', () => {
    it('should respond with 400 if missing user details', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.addUser(req, res);
  
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Missing User Details' })).to.be.true;
    });
  
    it('should respond with 403 if ID already added', async () => {
       const findOneStub = sinon.stub(helpers, 'findOne');
      findOneStub.returns({ id: 'existingUserId' });
  
      const req = {
        body: {
          id: 'existingUserId', // Existing ID
          name:"test name",
          email:"existing@example.com",
          address:"Nugegoda Wijerama",
          city:"Nugegoda",
          country:"SL"
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.addUser(req, res);
  
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ error: 'This ID already added' })).to.be.true;
  
      findOneStub.restore(); 
    });
  
    it('should respond with 403 if Email already added', async () => {
        const findOneStub = sinon.stub(helpers, 'findOne');
        findOneStub.returns({ email: 'existing@example.com' });
    
        const req = {
          body: {
            email: 'existing@example.com', // Existing Email
            id: 'existingUserId', 
            name:"test",
            address:"test address",
            city:"colombo",
            country:"SL"
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.spy(),
        };
    
        await userController.addUser(req, res);
    
        expect(res.status.calledWith(403))
        expect(res.json.calledWith({ error: 'This Email already added' }))
    
        findOneStub.restore(); // Restore the stub after the test
      });
    
   
    it('should create a user and respond with 201', async () => {
      const findOneStub = sinon.stub(helpers, 'findOne');
      findOneStub.returns(null);
  
      const saveStub = sinon.stub(helpers, 'save');
      saveStub.returns(true);
  
      const req = {
        body: {
          id: 'newUserId',
          email: 'test@gmail.com',
          name:"test",
          address:"Maharagama",
          city:"Kelaniya",
          country:"SL"
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.addUser(req, res);
  
      expect(res.status.calledWith(201))
      expect(res.json.calledWith({ status: 'User Created Successfully, Please check your email' }))
  
      findOneStub.restore();
      saveStub.restore(); 
    });
  
 });

//Get User
describe('View User Details', () => {
    it('should respond with 400 if missing ID', async () => {
      const req = {
        params: {},
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.getUser(req, res);
  
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Missing Field' })).to.be.true;
    });
  
    it('should respond with 200 and the user data', async () => {
      const findOneStub = sinon.stub(helpers, 'findOne');
      const userObject = { id: 'userId', name: 'John Doe', email: 'johndoe@example.com',address:"Address- Testing", country:"SL",city:"Colombo" };
      findOneStub.returns(userObject);
  
      const req = {
        params: {
          id: '123V', // Existing user ID
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.getUser(req, res);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ user: userObject })).to.be.true;
  
      findOneStub.restore(); 
    });
  
  
  });
 
//Update User
describe('Update User', () => {
    it('should respond with 400 if missing fields', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.updateUser(req, res);
  
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Missing Field' })).to.be.true;
    });
  
    it('should respond with 403 if ID not found', async () => {
      const findOneStub = sinon.stub(helpers, 'findOne');
      findOneStub.returns(null);
  
      const req = {
        body: {
          id: 'nonExistentUserId', // Non-existent ID
          address:"Nugegoda Wijerama",
          city:"Nugegoda",
          country:"SL",
          name:"Test name",
          email:"test@gmail.com"
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.updateUser(req, res);
  
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ error: 'Please check ID, This ID not found' })).to.be.true;
  
      findOneStub.restore(); 
    });
  
   
    it('should respond with 403 if Email already added', async () => {
        const findOneStub = sinon.stub(helpers, 'findOne');
        findOneStub.returns({ dataValues: { email: 'pifew20403@cdeter.com' } });
    
        const req = {
          body: {
            id: 'existingUserId', // Existing user ID
            email: 'existing@example.com', // Existing email
            address:"Nugegoda Wijerama",
            city:"Nugegoda",
            country:"SL",
            name:"Test name",
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.spy(),
        };
    
        await userController.updateUser(req, res);
    
        expect(res.status.calledWith(403))
        expect(res.json.calledWith({ error: 'This Email already added' }))
    
        findOneStub.restore(); 
      });
    
    it('should update user and respond with 200', async () => {
        const findOneStub = sinon.stub(helpers, 'findOne');
        findOneStub.returns({ dataValues: { email: 'pifew20403@cdeter.com' } });
    
        const updateStub = sinon.stub(registrationModel, 'update');
        updateStub.returns(true);
    
        const req = {
          body: {
            id: '123V', // Existing user ID
            email: 'new123@example.com', // New email
            city:"Nugegoda",
            country:"SL",
            name:"Test name",
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.spy(),
        };
    
        await userController.updateUser(req, res);
    
        expect(res.status.calledWith(200))
        expect(res.json.calledWith({ status: 'Updated Successfully' }))
    
        findOneStub.restore(); 
        updateStub.restore(); 
      });
  
  });
  
//Delete User
describe('Delete User', () => {
    it('should respond with 400 if missing ID', async () => {
      const req = {
        params: {},
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.deleteUser(req, res);
  
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Missing Required ID' })).to.be.true;
    });
  
    it('should respond with 200 and delete user', async () => {
      const deleteUserStub = sinon.stub(helpers, 'deleteUser');
      deleteUserStub.returns(true);
  
      const req = {
        params: {
          id: '123V', // User ID to delete
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
  
      await userController.deleteUser(req, res);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'User has been deleted' })).to.be.true;
  
      deleteUserStub.restore(); 
    });
  
  });
  