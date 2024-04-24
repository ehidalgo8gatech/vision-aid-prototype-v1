import handler, { allUsers } from '../user';

const mockGet = jest.fn();
const mockGetAll = jest.fn();
const mockCreate = jest.fn();
const mockDelete = jest.fn();
const mockUpdate = jest.fn();
jest.mock('auth0', () => {
  return {
    ManagementClient: jest.fn().mockImplementation(() => {
      return { 
        users: {
          create: () => mockCreate(),
          getAll: () => mockGetAll(),
          delete: () => mockDelete(),
          get: () => mockGet(),
          update: () => mockUpdate(),
        }
      }
    })
  }
});

function MockResponse() {
  this.code = null;
  this.data = null;
  this.success = undefined;
}

MockResponse.prototype.status = function (code) {
  this.code = code;
  return this;
}

MockResponse.prototype.json = function(data, success) {
  this.data = data;
  if (success) this.success = success;
  return this;
}

MockResponse.prototype.end = function() {
  return this;
}

describe('User API Tests', () => {
  it('should retrieve all the users from Auth0', async () => {
    const usersToGet = [
      {
        user_id: 'auth0|12345',
        name: 'Test User',
        email: 'testuser123@test.com',
        app_metadata: {
          va_partners: {
            admin: true,
            hospitalRole: [
              { id: 1, admin: true }
            ]
          }
        },
        last_login: '2024-04-10T20:56:22.456Z'
      },
      {
        user_id: 'auth0|23456',
        name: 'Test User 2',
        email: 'testuser234@test.com',
        app_metadata: {
          va_partners: {
            admin: false,
            hospitalRole: [
              { id: 1, admin: false }
            ]
          }
        }
      }
    ];

    mockGetAll.mockImplementationOnce(() => {
      return { data: usersToGet }
    });

    const results = await allUsers();
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      id: 'auth0|12345',
      name: 'Test User',
      email: 'testuser123@test.com',
      admin: true,
      hospitalRole: [
        { id: 1, admin: true }
      ],
      lastLogin: 1712782582456,
    });
    expect(results[1]).toEqual({
      id: 'auth0|23456',
      name: 'Test User 2',
      email: 'testuser234@test.com',
      admin: false,
      hospitalRole: [
        { id: 1, admin: false }
      ],
      lastLogin: null,
    });
  });

  it('should create a user in Auth0', async () => {
    const expectedUser = {
      name: 'Test User',
      email: 'testuser123@test.com',
      admin: false,
      hospitalRole: [ { hospitalId: 1, admin: true } ]
    };

    mockCreate.mockImplementationOnce(() => {
      return { data: {
        name: expectedUser.name,
        email: expectedUser.email,
        app_metadata: {
          va_partners: {
            admin: expectedUser.admin,
            hospitalRole: expectedUser.hospitalRole
          }
        }
      } };
    });

    const req = {
      method: 'POST',
      body: {
        email: expectedUser.email,
        admin: expectedUser.admin,
        name: expectedUser.name,
        password: 'TestPassowrd123!'
      }
    };
    const res = new MockResponse();

    await handler(req, res);
    expect(res.data).toEqual(expectedUser);
    expect(res.code).toBe(200);
    expect(res.success).toEqual({ success: true });
  });

  it('should update an Auth0 user', async () => {
    const mockUser = {
      name: "Test User",
      id: "testuser123",
      email: 'testuser123@gmail.com',
      app_metadata: {
        'va_partners': {
          hospitalRole: [
            { id: 1, admin: false }
          ],
          admin: false
        }
      }
    };

    mockGet.mockImplementationOnce(() => {
      return { data: mockUser };
    });

    mockUpdate.mockImplementationOnce(() => {
      return { status: 200 };
    });

    const req = {
      method: 'PATCH',
      query: {
        id: "testuser123"
      },
      body: {
        admin: true,
        name: 'New Name',
      }
    };
    const res = new MockResponse();

    await handler(req, res);
    expect(res.code).toBe(200);
  });

  describe('Delete User', () => {
    it('should delete a user in Auth0', async () => {
      mockDelete.mockImplementationOnce(() => {
        return { status: 204 };
      });
  
      const req = {
        method: 'DELETE',
        query: {
          id: "testuser123"
        }
      };
      const res = new MockResponse();
      await handler(req, res);
      expect(res.code).toBe(204);
    });

    it('should fail to delete a user in Auth0', async () => {
      mockDelete.mockImplementationOnce(() => {
        return { status: 500, statusText: "Something went wrong..." };
      });
  
      const req = {
        method: 'DELETE',
        query: {
          id: "testuser123"
        }
      };
      const res = new MockResponse();
      await handler(req, res);
      expect(res.code).toBe(500);
    });
  })
});
