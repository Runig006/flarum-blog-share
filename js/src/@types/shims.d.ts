import BlogShare from './BlogShare';

declare module 'flarum/common/models/Discussion' {
  export default interface Discussion {
    blogShare: () => false | BlogShare;
  }
}
