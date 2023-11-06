<?php

/*
 * This file is part of fof/sitemap.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

 namespace Runig006\FlarumBlogShare\Console;

use Illuminate\Console\Scheduling\Event;

class ShareArticleShedule
{
    public function __invoke(Event $event)
    {
        $event->onOneServer()
            ->withoutOverlapping()
            ->everyTenMinutes();
    }
}
