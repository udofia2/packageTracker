import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'A logistics system management API documentation',
    version: '0.0.1',
    description:
      'This is a logistic management system that allows drivers and customers to track packages in realtime as the driver move across the map \n\n\n',
    license: {
      name: 'MIT',
      url: '',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
    {
      url: `https://packagetracker-tj2e.onrender.com/v1`,
      description: 'Live Server',
    },
  ],
};

export default swaggerDefinition;
