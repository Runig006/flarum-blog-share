<?php

namespace Runig006\FlarumBlogShare\Entities;

use Flarum\Database\AbstractModel;
use Flarum\Discussion\Discussion;

class BlogShare extends AbstractModel
{
    protected $table = 'blog_share';

    protected $fillable = [
        'discussion_id',
        'telegram_share',
        'telegram_title',
        'telegram_body',
        'telegram_button_text',
        'telegram_button_url',
        'telegram_button_rows',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function discussion()
    {
        return $this->belongsTo(Discussion::class, 'discussion_id');
    }
}
