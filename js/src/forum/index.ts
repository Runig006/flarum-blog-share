import Model from 'flarum/common/Model';
import Discussion from 'flarum/common/models/Discussion';

import BlogShare from '../@types/BlogShare';
import AddOptions from './AddOptions';

// We provide our extension code in the form of an "initializer".
// This is a callback that will run after the core has booted.
app.initializers.add('runig006-flarum-blog-share', function (app) {
    app.store.models.blogShare = BlogShare;
    Discussion.prototype.blogShare = Model.hasOne<BlogShare>('blogShare');
    AddOptions();
});