import InfiniteScroll from './src/infinitescroll.js'
import Loading from './src/loading.js'
export default (app) => {
  app.directive('InfiniteScroll', InfiniteScroll)
  app.directive('loading', Loading)
}
