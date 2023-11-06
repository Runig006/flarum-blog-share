import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin';

export default class BlogShare extends mixin(Model, {
  discussion: Model.hasOne('discussion'),
  telegram: Model.attribute('telegram'),
}) {}
