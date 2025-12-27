export default defineNuxtRouteMiddleware((to , from) => {
  const user = useSupabaseUser();
  if (user.value) {
    return;
  }
  return navigateTo("/login");

  // ///// for global
  // const protectedPaths = [
  //   '/profile',
  //   // '/my-ads',
  //   // '/messages',
  //   // '/favorites'
  // ]

  // const needsAuth = protectedPaths.some(path => to.path.startsWith(path))

  // if (needsAuth && !user.value) {
  //   return navigateTo({
  //     path: '/login',
  //     query: { redirect: to.fullPath }
  //   })
  // }
});
