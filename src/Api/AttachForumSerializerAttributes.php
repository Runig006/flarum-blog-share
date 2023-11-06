<?php

namespace Runig006\FlarumBlogShare\Api;

use Exception;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;

class AttachForumSerializerAttributes
{
    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        // Get Flarum settings
        $this->settings = $settings;
    }

    /**
     * @param Serializing $event
     */
    public function __invoke(ForumSerializer $serializer, $model, $attributes)
    {
        // Populate forum settings
        $attributes['blogShareTelegram'] = $this->settings->get('runig006-blog-share.telegram_enabled', false);
        $attributes['canAutoShare'] = $serializer->getActor()->can('blog-share.autoShare');
        return $attributes;
    }
}
