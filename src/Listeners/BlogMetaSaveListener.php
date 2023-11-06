<?php

namespace Runig006\FlarumBlogShare\Listeners;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Flarum\Discussion\Event\Saving;
use V17Development\FlarumBlog\BlogMeta\BlogMeta;
use Illuminate\Support\Arr;
use Runig006\FlarumBlogShare\Entities\BlogShare;
use V17Development\FlarumBlog\Event\BlogMetaSaving;

class BlogMetaSaveListener
{
    /**
     * CreateBlogMetaOnDiscussionCreate constructor.
     *
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
    }

    /**
     * @param $event
     */
    public function handle(BlogMetaSaving $event)
    {
        $meta = $event->blogMeta;
        if ($meta->sharing == null) {
            $sharing = new BlogShare(['meta_id' => $meta->id]);
            $sharing->save();
        }
    }
}
