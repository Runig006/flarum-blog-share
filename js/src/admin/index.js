import app from 'flarum/admin/app';

const settingsPrefix = 'runig006-blog-share.';
const settingsTranslation = 'runig006-blog-share.admin.settings.';

app.initializers.add('runig006-blog-share', () => {
  // Register extension settings page
  app.extensionData
    .for('runig006-blog-share')
    .registerSetting({
        type: 'boolean',
        setting: settingsPrefix + 'telegram_enabled',
        label: app.translator.trans(settingsTranslation + 'telegram_enabled')
      })
    .registerSetting({
      type: 'text',
      setting: settingsPrefix + 'telegram_token',
      label: app.translator.trans(settingsTranslation + 'telegram_token.label'),
      help: app.translator.trans(settingsTranslation + 'telegram_token.help')
    })
    .registerSetting({
      type: 'text',
      setting: settingsPrefix + 'telegram_chat_id',
      label: app.translator.trans(settingsTranslation + 'telegram_chat_id.label'),
      help: app.translator.trans(settingsTranslation + 'telegram_chat_id.help')
    })
    .registerSetting({
      type: 'text',
      setting: settingsPrefix + 'telegram_buttons_per_row',
      label: app.translator.trans(settingsTranslation + 'telegram_buttons_per_row.label'),
      help: app.translator.trans(settingsTranslation + 'telegram_buttons_per_row.help')
    })
    .registerPermission(
      {
        icon: 'fas fa-share',
        label: app.translator.trans('runig006-blog-share.admin.permissions.auto_share'),
        permission: 'blog-share.autoShare',
      },
      'blog',
      90
    );
});
