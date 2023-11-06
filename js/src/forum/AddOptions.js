import { extend } from 'flarum/extend';
import app from 'flarum/forum/app';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import BlogShareSettingsModal from './modals/BlogShareSettingsModal';
import Button from 'flarum/common/components/Button';

export default function () {
    extend(DiscussionControls, 'userControls', function (items, discussion, context) {
        if (discussion.blogMeta() == false || app.forum.attribute('canAutoShare') == false) {
            return;
        }
        if (app.forum.attribute('blogShareTelegram')) {
            items.add(
                'telegramShare',
                Button.component(
                    {
                        className: 'Button',
                        onclick: () => app.modal.show(BlogShareSettingsModal, { discussion: discussion, mode: 'telegram' }),
                        icon: 'fab fa-telegram',
                        disabled: discussion.blogShare()?.data?.attributes.telegram.shared,
                    },
                    app.translator.trans('runig006-blog-share.forum.buttons.telegram')
                ),
                -16
            );
        }
    });
}