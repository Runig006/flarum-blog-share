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
    this.telegram_image = Stream(this.share?.telegram()?.image, null);
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

    //IMAGE
    let fofUploadButton = null;
    if ('fof-upload' in flarum.extensions && app.forum.attribute('fof-upload.canUpload')) {
      const {
        components: { Uploader, FileManagerModal },
      } = require('@fof-upload');
      const uploader = new Uploader();
      fofUploadButton = (
        <Button
          class="Button Button--icon"
          onclick={async () => {
            app.modal.show(
              FileManagerModal,
              {
                uploader: uploader,
                onSelect: (files) => {
                  const file = app.store.getById('files', files[0]);

                  this.telegram_image(file.url());
                },
              },
              true
            );
          }}
          icon="fas fa-cloud-upload-alt"
        />
      );
    }

    items.add(
      'image',
      <div className="Form-group V17Blog-ArticleImage">
        <label>{app.translator.trans('v17development-flarum-blog.forum.article_settings.fields.image.title')}:</label>
        <div data-upload-enabled={!!fofUploadButton}>
          <input type="text" className="FormControl" bidi={this.telegram_image} placeholder="https://" />
          {fofUploadButton}
        </div>

        <small>{app.translator.trans('v17development-flarum-blog.forum.article_settings.fields.image.helper_text')}</small>

        {this.telegram_image()?.length > 2 && (
          <img
            src={this.telegram_image()}
            alt="Article image"
            title={app.translator.trans('v17development-flarum-blog.forum.article_settings.fields.image.title')}
            style={{ width: '100%', marginTop: '15px' }}
          />
        )}
      </div>,
      -10
    );
    //END IMAGE
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
