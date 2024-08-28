import express, { Router } from 'express';
import docsRoute from './swagger.route';
import packageRoute from './package.route';
import deliveryRoute from './delivery.route';

const router = express.Router();


interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/package',
    route: packageRoute,
  },
  {
    path: '/delivery',
    route: deliveryRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];



defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
