const allRoles = {
  admin: [
    'getUsers',
    'manageUsers',
    'createPackage',
    'updatePackage',
    'deletePackage',
    'getPackage',
    'getPackages',
    'createDelivery',
    'updateDelivery',
    'deleteDelivery',
    'getDelivery',
    'getDeliveries',
  ],
  driver: ['updatePackage', 'getPackage', 'getPackages', 'updateDelivery', 'getDelivery', 'getDeliveries'],
  customer: ['getPackage', 'getPackages', 'getDelivery', 'getDeliveries'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
