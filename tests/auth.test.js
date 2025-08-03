const request = require('supertest');
const app = require('./testServer');
const User = require('../models/User');

describe('Auth API Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    let validUserData;
    
    beforeEach(() => {
      validUserData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        birthdate: '1990-01-01'
      };
    });

    describe('Valid Signup', () => {
      it('should create a new user with valid data', async () => {
        const response = await request(app)
          .post('/api/auth/signup')
          .send(validUserData)
          .expect(201);

        expect(response.body).toHaveProperty('message', 'User created successfully');
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('name', validUserData.name);
        expect(response.body.user).toHaveProperty('email', validUserData.email);
        expect(response.body.user).toHaveProperty('birthdate');
        expect(response.body.user).not.toHaveProperty('password'); // Password should be hidden
        expect(response.body.user).toHaveProperty('_id');
        expect(response.body.user).toHaveProperty('createdAt');
        expect(response.body.user).toHaveProperty('updatedAt');
      });

      it('should hash the password before saving', async () => {
        await request(app)
          .post('/api/auth/signup')
          .send(validUserData)
          .expect(201);

        const user = await User.findOne({ email: validUserData.email });
        expect(user.password).not.toBe(validUserData.password);
        expect(user.password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt hash pattern
      });
    });

    describe('Validation Errors', () => {
      it('should return 400 when no data is provided', async () => {
        const response = await request(app)
          .post('/api/auth/signup')
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Name is required');
      });

      it('should return 400 when name is missing', async () => {
        const userDataWithoutName = { ...validUserData };
        delete userDataWithoutName.name;

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithoutName)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Name is required');
      });

      it('should return 400 when name is too short', async () => {
        const userDataWithShortName = { ...validUserData, name: 'A' };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithShortName)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Name must be at least 2 characters long');
      });

      it('should return 400 when name is too long', async () => {
        const userDataWithLongName = { ...validUserData, name: 'A'.repeat(51) };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithLongName)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Name must not exceed 50 characters');
      });

      it('should return 400 when email is missing', async () => {
        const userDataWithoutEmail = { ...validUserData };
        delete userDataWithoutEmail.email;

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithoutEmail)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Email is required');
      });

      it('should return 400 when email is invalid', async () => {
        const userDataWithInvalidEmail = { ...validUserData, email: 'invalid-email' };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithInvalidEmail)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Please enter a valid email address');
      });

      it('should return 400 when password is missing', async () => {
        const userDataWithoutPassword = { ...validUserData };
        delete userDataWithoutPassword.password;

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithoutPassword)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Password is required');
      });

      it('should return 400 when password is too short', async () => {
        const userDataWithShortPassword = { ...validUserData, password: '123' };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithShortPassword)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Password must be at least 6 characters long');
      });

      it('should return 400 when birthdate is missing', async () => {
        const userDataWithoutBirthdate = { ...validUserData };
        delete userDataWithoutBirthdate.birthdate;

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithoutBirthdate)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Birthdate is required');
      });

      it('should return 400 when birthdate is in the future', async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const userDataWithFutureBirthdate = { ...validUserData, birthdate: futureDate.toISOString().split('T')[0] };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(userDataWithFutureBirthdate)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Birthdate cannot be in the future');
      });
    });

    describe('Duplicate User', () => {
      it('should return 400 when user with same email already exists', async () => {
        // First signup
        await request(app)
          .post('/api/auth/signup')
          .send(validUserData)
          .expect(201);

        // Second signup with same email
        const response = await request(app)
          .post('/api/auth/signup')
          .send(validUserData)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'User already exists with this email');
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty JSON body', async () => {
        const response = await request(app)
          .post('/api/auth/signup')
          .set('Content-Type', 'application/json')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Name is required');
      });

      it('should handle malformed JSON', async () => {
        const response = await request(app)
          .post('/api/auth/signup')
          .set('Content-Type', 'application/json')
          .send('{"name": "test", "email": "test@test.com", "password": "123456", "birthdate": "1990-01-01"')
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid JSON in request body');
      });
    });
  });

  describe('POST /api/auth/login', () => {
    let validUserData;

    beforeEach(async () => {
      validUserData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        birthdate: '1990-01-01'
      };
      
      // Create a user before each login test
      await request(app)
        .post('/api/auth/signup')
        .send(validUserData);
    });

    describe('Valid Login', () => {
      it('should login successfully with correct credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email,
            password: validUserData.password
          })
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('email', validUserData.email);
        expect(response.body.user).toHaveProperty('name', validUserData.name);
        expect(response.body.user).not.toHaveProperty('password');
      });
    });

    describe('Invalid Login', () => {
      it('should return 400 when no data is provided', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .expect(400);

        expect(response.body).toHaveProperty('error', '"email" is required');
      });

      it('should return 400 when email is missing', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ password: validUserData.password })
          .expect(400);

        expect(response.body).toHaveProperty('error', '"email" is required');
      });

      it('should return 400 when password is missing', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ email: validUserData.email })
          .expect(400);

        expect(response.body).toHaveProperty('error', '"password" is required');
      });

      it('should return 400 when email is invalid', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'invalid-email',
            password: validUserData.password
          })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });

      it('should return 400 when user does not exist', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: validUserData.password
          })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid email or password');
      });

      it('should return 400 when password is incorrect', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email,
            password: 'wrongpassword'
          })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid email or password');
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty JSON body', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .set('Content-Type', 'application/json')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', '"email" is required');
      });

      it('should handle malformed JSON', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .set('Content-Type', 'application/json')
          .send('{"email": "test@test.com", "password": "123456"')
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid JSON in request body');
      });
    });
  });

  describe('JWT Token Validation', () => {
    it('should generate valid JWT tokens', async () => {
      const userData = {
        name: 'JWT Test User',
        email: `jwt${Date.now()}@example.com`,
        password: 'password123',
        birthdate: '1990-01-01'
      };

      // Test signup token
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(signupResponse.body.token).toBeDefined();
      expect(typeof signupResponse.body.token).toBe('string');
      expect(signupResponse.body.token.split('.')).toHaveLength(3); // JWT has 3 parts

      // Test login token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.token).toBeDefined();
      expect(typeof loginResponse.body.token).toBe('string');
      expect(loginResponse.body.token.split('.')).toHaveLength(3);
    });
  });
}); 