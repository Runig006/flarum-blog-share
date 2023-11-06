import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import Switch from 'flarum/common/components/Switch';

const settingsTranslation = 'runig006-blog-share.forum.share_settings.';

export default class BlogShareSettingsModal extends Modal {


  oninit(vnode) {
    let t = this;
    super.oninit(vnode);
    console.log(this.attrs.discussion.blogShare());
    this.share = this.attrs.discussion && this.attrs.discussion.blogShare() ? this.attrs.discussion.blogShare() : app.store.createRecord('blogShare');
    this[this.attrs.mode + "CreateValues"]();
  }


  className() {
    return 'Modal--small Support-Modal';
  }

  title() {
    return app.translator.trans('runig006-blog-share.forum.share_settings.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">{this.fields().toArray()}</div>
      </div>
    );
  }

  fields() {
    const items = new ItemList();
    this[this.attrs.mode + "GetFields"](items);
    items.add(
      'submit',
      <div className="Form-group">
        {Button.component(
          {
            type: 'submit',
            className: 'Button Button--primary SupportModal-save',
            loading: this.loading,
          },
          app.translator.trans('core.forum.composer_edit.submit_button')
        )}
      </div>,
      -10
    );
    return items;
  }

  /////////////////
  // TELEGRAM
  ////////////////

  telegramCreateValues() {
    this.telegram_share = Stream(this.share?.telegram()?.share, false);
    this.telegram_title = Stream(this.share?.telegram()?.title, null);
    this.telegram_body = Stream(this.share?.telegram()?.body, null);
    this.telegram_button_text = Stream(this.share?.telegram()?.button_text, null);
    this.telegram_button_url = Stream(this.share?.telegram()?.button_url, null);
    this.telegram_button_rows = Stream(this.share?.telegram()?.button_rows, null);
  }

  telegramGetFields(items) {
    items.add(
      'telegramShared',
      <div className="Form-group">
        {Switch.component(
          {
            state: this.telegram_share() == true,
            onchange: (val) => {
              this.telegram_share(val);
            },
          },
          [
            <b>{app.translator.trans(settingsTranslation + 'telegram.share')}</b>,
          ]
        )}
      </div>,
      -10
    );

    items.add(
      'telegramTitle',
      <div className="Form-group">
        <label>{app.translator.trans(settingsTranslation + 'telegram.title.label')}:</label>
        <input className="FormControl" bidi={this.telegram_title} />
        <small>{app.translator.trans(settingsTranslation + 'telegram.title.help')}</small>
      </div>,
      -10
    );
    items.add(
      'telegramBody',
      <div className="Form-group">
        <label>{app.translator.trans(settingsTranslation + 'telegram.body.label')}:</label>
        <textarea
          className="FormControl"
          style={{
            maxWidth: '100%',
            minWidth: '100%',
            width: '100%',
            minHeight: '120px',
          }}
          bidi={this.telegram_body}
        />
        <small>{app.translator.trans(settingsTranslation + 'telegram.body.help')}</small>
      </div>,
      -10
    );
    items.add(
      'telegramButtonText',
      <div className="Form-group">
        <label>{app.translator.trans(settingsTranslation + 'telegram.button_text.label')}:</label>
        <input className="FormControl" bidi={this.telegram_button_text} />
        <small>{app.translator.trans(settingsTranslation + 'telegram.button_text.help')}</small>
      </div>,
      -10
    );
    items.add(
      'telegramButtonUrl',
      <div className="Form-group">
        <label>{app.translator.trans(settingsTranslation + 'telegram.button_url.label')}:</label>
        <textarea
          className="FormControl"
          style={{
            maxWidth: '100%',
            minWidth: '100%',
            width: '100%',
            minHeight: '120px',
          }} bidi={this.telegram_button_url} />
        <small>{app.translator.trans(settingsTranslation + 'telegram.button_url.help')}</small>
      </div>,
      -10
    );
    items.add(
      'telegramButtonRows',
      <div className="Form-group">
        <label>{app.translator.trans(settingsTranslation + 'telegram.button_rows.label')}:</label>
        <input className="FormControl" bidi={this.telegram_button_rows} />
        <small>{app.translator.trans(settingsTranslation + 'telegram.button_rows.help')}</small>
      </div>,
      -10
    );
  }

  onsubmit(e) {
    e.preventDefault();
    this.loading = true;
    let object = this.getObject();
    object.relationships = {
      discussion: this.attrs.discussion,
    };
    this.share.save(object).then(() => {
      if (this.attrs.discussion) {
        this.attrs.discussion.pushData({
          relationships: {
            blogShare: this.share,
          },
        });
      }

      this.hide();
      m.redraw();
    },
      (response) => {
        this.loading = false;
        this.handleErrors(response);
      }
    );
  }

  getObject() {
    let object = {};
    object[this.attrs.mode] = {};
    Object.keys(this).forEach((key) => {
      if (key.startsWith(this.attrs.mode)) {
        let cleanKey = key.replace(this.attrs.mode + "_", "");
        object[this.attrs.mode][cleanKey] = this[key];
      }
    });
    return object;
  }
}
