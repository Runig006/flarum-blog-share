<?php

namespace Runig006\FlarumBlogShare\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use V17Development\FlarumBlog\Api\Serializer\BlogMetaSerializer;

class ShareSerializer extends AbstractSerializer
{
    protected $type = 'blogShare';

    protected function getDefaultAttributes($share)
    {
        return [
            'telegram' => [
                'share' => (bool) $share->telegram_share,
                'shared' => $share->telegram_shared,
                'title' => $share->telegram_title,
                'body' => $share->telegram_body,
                'image' => $share->telegram_image,
                'button_text' => $share->telegram_button_text,
                'button_url' => $share->telegram_button_url,
                'button_rows' => $share->telegram_button_rows,
            ],
        ];
    }
}
