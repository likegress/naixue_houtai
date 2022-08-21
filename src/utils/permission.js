const isRouteHasPermission = ({ meta }, permissions) => {
  // 不含meta或者meta中不含permissions的所有登录用户均可见
  if (!meta || !meta.permissions) {
    return true;
  } else {
    // meta.permissions的任意一项在permissions中出现
    return meta.permissions.some(
      p => permissions.includes(p)
    );
  }
};

export const filterAuthRoutes = (authRoutes, permissions) => {
  const routes = [];
  authRoutes.forEach(route => {
    if (!route.children) {
      routes.push(route);
    } else {
      routes.push({
        ...route,
        children: route.children.filter(
          r => isRouteHasPermission(r, permissions)
        )
      });
    }
  });

  const menus = [];
  routes.find(r => r.path === '/main').children.forEach(r => {
    if (r.meta && r.meta.group) {
      const { group } = r.meta;
      const index = menus.findIndex(m => m.name === group.name);
      if (index === -1) {
        menus.push({
          ...group,
          children: [{
            name: r.name,
            path: '/main/' + r.path,
            icon: r.meta.icon
          }]
        });
      } else {
        menus[index].children.push({
          name: r.name,
          path: '/main/' + r.path,
          icon: r.meta.icon
        });
      }
    } else {
      menus.push({
        name: r.name,
        path: '/main/' + r.path,
        icon: r.meta.icon
      });
    }
  });

  return {
    routes,
    menus
  };
};
