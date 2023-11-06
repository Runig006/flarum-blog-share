<?php

namespace Runig006\FlarumShare;

use Flarum\Api\Controller as FlarumController;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Discussion\Discussion;
use Runig006\FlarumBlogShare\Entities\BlogShare;
use Flarum\Extend;
use Runig006\FlarumBlogShare\Api\AttachForumSerializerAttributes;
use Runig006\FlarumBlogShare\Api\Controller\CreateShareController;
use Runig006\FlarumBlogShare\Api\Controller\EditShareController;
use Runig006\FlarumBlogShare\Api\Serializer\ShareSerializer;
use Runig006\FlarumBlogShare\Console\ShareArticleCommand;
use Runig006\FlarumBlogShare\Console\ShareArticleShedule;

return [
    (new Extend\Locales(__DIR__ . '/locale')),
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Routes('api'))
        ->post('/blogShare', 'blog.share', CreateShareController::class)
        ->patch('/blogShare/{id}', 'blog.share.edit', EditShareController::class),

    (new Extend\Model(Discussion::class))
        ->hasOne('blogShare', BlogShare::class, 'discussion_id', 'id'),

    (new Extend\ApiController(FlarumController\CreateDiscussionController::class))
        ->addInclude('blogShare'),

    (new Extend\ApiController(FlarumController\ListDiscussionsController::class))
        ->addInclude('blogShare'),

    (new Extend\ApiController(FlarumController\ShowDiscussionController::class))
        ->addInclude('blogShare'),

    (new Extend\ApiController(FlarumController\UpdateDiscussionController::class))
        ->addInclude('blogShare'),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->hasOne('blogShare', ShareSerializer::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(AttachForumSerializerAttributes::class),


    (new Extend\Event)
        ->listen(BlogMetaSaving::class, BlogMetaSaveListener::class),

    (new Extend\Console)
        ->command(ShareArticleCommand::class)
        ->schedule(ShareArticleCommand::class, new ShareArticleShedule()),
];
